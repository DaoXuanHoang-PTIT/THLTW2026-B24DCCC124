import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Popconfirm, message, Typography, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, } from '@ant-design/icons';
import ModalKhoaHoc from './components/CourseModal';

const { Title } = Typography;
const { Option } = Select;

export interface KhoaHoc {
    id: string;
    tenKhoaHoc: string;
    giangVien: string;
    soHocVien: number;
    moTa: string;
    trangThai: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
}

export const danhSachGiangVien = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];

const KTGK = () => {
    const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>(() => {
        const duLieuLuu = localStorage.getItem('ktgk1_courses');
        if (duLieuLuu) {
            try {
                return JSON.parse(duLieuLuu);
            } catch (e) {
                return [];
            }
        }
        return [
            {
                id: '1',
                tenKhoaHoc: 'Lập trình Web Cơ bản với React',
                giangVien: 'Nguyễn Văn A',
                soHocVien: 50,
                moTa: 'Khoá học',
                trangThai: 'Đang mở'
            },
            {
                id: '2',
                tenKhoaHoc: 'Khóa học Node.js Nâng cao',
                giangVien: 'Trần Thị B',
                soHocVien: 0,
                moTa: 'Khoá học',
                trangThai: 'Tạm dừng'
            }
        ];
    });

    const [hienThiModal, setHienThiModal] = useState(false);
    const [khoaHocDangSua, setKhoaHocDangSua] = useState<KhoaHoc | null>(null);

    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
    const [locGiangVien, setLocGiangVien] = useState<string | null>(null);
    const [locTrangThai, setLocTrangThai] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('ktgk1_courses', JSON.stringify(danhSachKhoaHoc));
    }, [danhSachKhoaHoc]);

    const xuLyXoa = (id: string) => {
        const khoaHoc = danhSachKhoaHoc.find(k => k.id === id);
        if (khoaHoc && khoaHoc.soHocVien > 0) {
            message.error('Chỉ cho phép xóa khóa học chưa có học viên!');
            return;
        }
        setDanhSachKhoaHoc(danhSachKhoaHoc.filter(k => k.id !== id));
        message.success('Đã xóa khóa học thành công!');
    };

    const xuLyThemSua = (giaTri: any) => {
        const biTrung = danhSachKhoaHoc.some(
            k => k.tenKhoaHoc.trim().toLowerCase() === giaTri.tenKhoaHoc.trim().toLowerCase() && k.id !== khoaHocDangSua?.id
        );
        if (biTrung) {
            message.error('Tên khóa học đã tồn tại, vui lòng chọn tên khác!');
            return false;
        }

        if (khoaHocDangSua) {
            setDanhSachKhoaHoc(danhSachKhoaHoc.map(k => (k.id === khoaHocDangSua.id ? { ...k, ...giaTri } : k)));
            message.success('Cập nhật khóa học thành công!');
        } else {
            const idLonNhat = danhSachKhoaHoc.length > 0
                ? Math.max(...danhSachKhoaHoc.map(k => parseInt(k.id, 10) || 0))
                : 0;
            const idMoi = (idLonNhat + 1).toString();

            setDanhSachKhoaHoc([...danhSachKhoaHoc, { ...giaTri, id: idMoi }]);
            message.success('Thêm khóa học thành công!');
        }
        setHienThiModal(false);
        setKhoaHocDangSua(null);
        return true;
    };

    const cotDuLieu: ColumnsType<KhoaHoc> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'tenKhoaHoc',
            key: 'tenKhoaHoc',
            align: 'center',
        },
        {
            title: 'Giảng viên',
            dataIndex: 'giangVien',
            key: 'giangVien',
            align: 'center',

        },
        {
            title: 'Số học viên',
            dataIndex: 'soHocVien',
            key: 'soHocVien',
            align: 'center',
            sorter: (a: KhoaHoc, b: KhoaHoc) => a.soHocVien - b.soHocVien,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            align: 'center',
            render: (vanBan: string) => {
                let mauSac = 'green';
                if (vanBan === 'Đã kết thúc') mauSac = 'red';
                if (vanBan === 'Tạm dừng') mauSac = 'orange';
                return <Tag color={mauSac}>{vanBan}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'hanhDong',
            align: 'center',
            render: (_: any, banGhi: KhoaHoc) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            setKhoaHocDangSua(banGhi);
                            setHienThiModal(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khóa học này không?"
                        onConfirm={() => xuLyXoa(banGhi.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={banGhi.soHocVien > 0}
                    >
                        <span title={banGhi.soHocVien > 0 ? "Không thể xóa khóa học đã có học viên" : "Xóa khóa học"}>
                            <Button
                                danger
                                disabled={banGhi.soHocVien > 0}
                            >
                                Xóa
                            </Button>
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const danhSachDaLoc = danhSachKhoaHoc.filter(khoaHoc => {
        const khopTen = khoaHoc.tenKhoaHoc.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
        const khopGiangVien = locGiangVien ? khoaHoc.giangVien === locGiangVien : true;
        const khopTrangThai = locTrangThai ? khoaHoc.trangThai === locTrangThai : true;
        return khopTen && khopGiangVien && khopTrangThai;
    });

    return (
        <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: 24 }}>Hệ Thống Quản Lý Khóa Học Trực Tuyến</Title>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <Space wrap>
                    <Input
                        placeholder="Tìm kiếm theo tên khóa học..."
                        value={tuKhoaTimKiem}
                        onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Select
                        placeholder="Lọc theo giảng viên"
                        style={{ width: 200 }}
                        allowClear
                        value={locGiangVien}
                        onChange={(val) => setLocGiangVien(val)}
                    >
                        {danhSachGiangVien.map(gv => <Option key={gv} value={gv}>{gv}</Option>)}
                    </Select>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: 150 }}
                        allowClear
                        value={locTrangThai}
                        onChange={(val) => setLocTrangThai(val)}
                    >
                        <Option value="Đang mở">Đang mở</Option>
                        <Option value="Đã kết thúc">Đã kết thúc</Option>
                        <Option value="Tạm dừng">Tạm dừng</Option>
                    </Select>
                </Space>

                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setKhoaHocDangSua(null);
                        setHienThiModal(true);
                    }}
                >
                    Thêm Khóa Học Mới
                </Button>
            </div>

            <Table
                columns={cotDuLieu}
                dataSource={danhSachDaLoc}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                bordered
            />

            {hienThiModal && (
                <ModalKhoaHoc
                    hienThi={hienThiModal}
                    khiHuy={() => {
                        setHienThiModal(false);
                        setKhoaHocDangSua(null);
                    }}
                    khiDongY={xuLyThemSua}
                    giaTriBanDau={khoaHocDangSua}
                />
            )}
        </div>
    );
};

export default KTGK;
