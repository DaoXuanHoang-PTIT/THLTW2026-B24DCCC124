import { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Rate, Popconfirm, message, Space, Tag, Row, Col, Card, Statistic, Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { DiemDen, LichTrinh, lichTrinhMauTheoThang } from '../index';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

interface Props {
    danhSachDiemDen: DiemDen[];
    setDanhSachDiemDen: (val: DiemDen[] | ((prev: DiemDen[]) => DiemDen[])) => void;
    lichTrinh: LichTrinh;
}

const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const loaiMau: Record<string, string> = {
    'biển': 'blue',
    'núi': 'green',
    'thành phố': 'purple',
};

const QuanLyDiemDen = ({
    danhSachDiemDen,
    setDanhSachDiemDen,
}: {
    danhSachDiemDen: DiemDen[];
    setDanhSachDiemDen: (val: DiemDen[] | ((prev: DiemDen[]) => DiemDen[])) => void;
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDiemDen, setEditingDiemDen] = useState<DiemDen | null>(null);
    const [form] = Form.useForm();

    const showModal = () => {
        setEditingDiemDen(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: DiemDen) => {
        setEditingDiemDen(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        setDanhSachDiemDen(ds => ds.filter(d => d.id !== id));
        message.success('Đã xóa điểm đến');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingDiemDen) {
                setDanhSachDiemDen(ds => ds.map(d =>
                    d.id === editingDiemDen.id ? { ...editingDiemDen, ...values } : d
                ));
                message.success('Cập nhật điểm đến thành công');
            } else {
                const moi: DiemDen = {
                    ...values,
                    id: Math.random().toString(36).substr(2, 9),
                    luotChon: 0,
                };
                setDanhSachDiemDen(ds => [...ds, moi]);
                message.success('Thêm điểm đến thành công');
            }
            setIsModalVisible(false);
        });
    };

    const columns = [
        { title: 'Tên', dataIndex: 'ten', key: 'ten', sorter: (a: DiemDen, b: DiemDen) => a.ten.localeCompare(b.ten) },
        {
            title: 'Loại',
            dataIndex: 'loai',
            key: 'loai',
            render: (loai: string) => <Tag color={loaiMau[loai]}>{loai}</Tag>,
            filters: [
                { text: 'Biển', value: 'biển' },
                { text: 'Núi', value: 'núi' },
                { text: 'Thành phố', value: 'thành phố' },
            ],
            onFilter: (value: boolean | string | number, record: DiemDen) => record.loai === value,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (r: number) => <Rate disabled allowHalf value={r} style={{ fontSize: 13 }} />,
            sorter: (a: DiemDen, b: DiemDen) => a.rating - b.rating,
        },
        {
            title: 'Chi phí/ngày',
            key: 'chiPhi',
            render: (_: any, r: DiemDen) => formatVND(r.chiPhiAnUong + r.chiPhiLuuTru + r.chiPhiDiChuyen),
        },
        {
            title: 'Lượt chọn',
            dataIndex: 'luotChon',
            key: 'luotChon',
            sorter: (a: DiemDen, b: DiemDen) => a.luotChon - b.luotChon,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: DiemDen) => (
                <Space>
                    <Button size="small" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xóa điểm đến này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Thêm điểm đến mới
            </Button>
            <Table columns={columns} dataSource={danhSachDiemDen} rowKey="id" scroll={{ x: 800 }} />

            <Modal
                title={editingDiemDen ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editingDiemDen ? 'Cập nhật' : 'Thêm mới'}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="ten" label="Tên điểm đến" rules={[{ required: true, message: 'Nhập tên điểm đến!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loai" label="Loại hình" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="biển">Biển</Option>
                                    <Option value="núi">Núi</Option>
                                    <Option value="thành phố">Thành phố</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="hinhAnh" label="URL hình ảnh">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="thoiGianThamQuan" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="chiPhiAnUong" label="Chi phí ăn uống (VND)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={50000} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="chiPhiLuuTru" label="Chi phí lưu trú (VND)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={100000} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="chiPhiDiChuyen" label="Chi phí di chuyển (VND)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={50000} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

const ThongKe = ({
    danhSachDiemDen,
    lichTrinh,
}: {
    danhSachDiemDen: DiemDen[];
    lichTrinh: LichTrinh;
}) => {
    const tongDiaDiem = danhSachDiemDen.length;
    const tongLuotLich = lichTrinh.cacMuc.length;

    const tongChi = lichTrinh.cacMuc.reduce((sum, m) => {
        const d = danhSachDiemDen.find(x => x.id === m.diemDenId);
        return sum + (d ? d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen : 0);
    }, 0);
    const tongAn = lichTrinh.cacMuc.reduce((sum, m) => sum + (danhSachDiemDen.find(x => x.id === m.diemDenId)?.chiPhiAnUong || 0), 0);
    const tongLuu = lichTrinh.cacMuc.reduce((sum, m) => sum + (danhSachDiemDen.find(x => x.id === m.diemDenId)?.chiPhiLuuTru || 0), 0);
    const tongDi = lichTrinh.cacMuc.reduce((sum, m) => sum + (danhSachDiemDen.find(x => x.id === m.diemDenId)?.chiPhiDiChuyen || 0), 0);

    const topDiaDiem = [...danhSachDiemDen].sort((a, b) => b.luotChon - a.luotChon).slice(0, 5);
    const thangData = [...lichTrinhMauTheoThang];

    const barThangOptions: ApexCharts.ApexOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: thangData.map(t => t.thang) },
        colors: ['#1890ff'],
        dataLabels: { enabled: true },
        tooltip: { y: { formatter: val => `${val} lịch trình` } },
        plotOptions: { bar: { borderRadius: 4 } },
    };
    const barThangSeries = [{ name: 'Lịch trình', data: thangData.map(t => t.soLuot) }];

    const barDiaDiemOptions: ApexCharts.ApexOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: topDiaDiem.map(d => d.ten) },
        colors: ['#52c41a'],
        dataLabels: { enabled: true },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        tooltip: { y: { formatter: val => `${val} lượt` } },
    };
    const barDiaDiemSeries = [{ name: 'Lượt chọn', data: topDiaDiem.map(d => d.luotChon) }];

    const pieOptions: ApexCharts.ApexOptions = {
        chart: { type: 'pie' },
        labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
        colors: ['#52c41a', '#1890ff', '#faad14'],
        legend: { position: 'bottom' },
        tooltip: { y: { formatter: val => formatVND(val) } },
    };
    const pieSeries = [tongAn, tongLuu, tongDi];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Tổng điểm đến" value={tongDiaDiem} suffix="địa điểm" /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Mục trong lịch trình" value={tongLuotLich} suffix="điểm" /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Tổng chi phí" value={formatVND(tongChi)} valueStyle={{ fontSize: 16 }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Địa điểm phổ biến nhất"
                            value={topDiaDiem[0]?.ten || 'N/A'}
                            valueStyle={{ fontSize: 14 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Số lượng lịch trình tạo theo tháng">
                        <ReactApexChart options={barThangOptions} series={barThangSeries} type="bar" height={300} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Địa điểm phổ biến (lượt chọn)">
                        {topDiaDiem.some(d => d.luotChon > 0) ? (
                            <ReactApexChart options={barDiaDiemOptions} series={barDiaDiemSeries} type="bar" height={300} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <Text type="secondary">Thêm điểm đến vào lịch trình để xem thống kê</Text>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Phân bổ ngân sách theo hạng mục">
                        {tongChi > 0 ? (
                            <ReactApexChart options={pieOptions} series={pieSeries} type="pie" height={300} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <Text type="secondary">Chưa có dữ liệu chi phí</Text>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Chi tiết chi phí từng hạng mục">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {[
                                    { label: 'Ăn uống', value: tongAn, color: '#52c41a' },
                                    { label: 'Lưu trú', value: tongLuu, color: '#1890ff' },
                                    { label: 'Di chuyển', value: tongDi, color: '#faad14' },
                                    { label: 'Tổng cộng', value: tongChi, color: '#f5222d' },
                                ].map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 8px', fontWeight: idx === 3 ? 700 : 400 }}>{row.label}</td>
                                        <td style={{ padding: '12px 8px', textAlign: 'right', color: row.color, fontWeight: idx === 3 ? 700 : 400 }}>
                                            {formatVND(row.value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const QuanTriAdmin = ({ danhSachDiemDen, setDanhSachDiemDen, lichTrinh }: Props) => {
    return (
        <div>
            <Tabs defaultActiveKey="a1">
                <TabPane tab="Quản lý điểm đến" key="a1">
                    <QuanLyDiemDen
                        danhSachDiemDen={danhSachDiemDen}
                        setDanhSachDiemDen={setDanhSachDiemDen}
                    />
                </TabPane>
                <TabPane tab="Thống kê" key="a2">
                    <ThongKe
                        danhSachDiemDen={danhSachDiemDen}
                        lichTrinh={lichTrinh}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default QuanTriAdmin;
