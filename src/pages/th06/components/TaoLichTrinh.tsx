import { useState } from 'react';
import {
    Row, Col, Card, Button, Space, Typography, Tag, Popconfirm,
    message, InputNumber, Select, Empty, Statistic,
} from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { DiemDen, LichTrinh, MucLichTrinh } from '../index';

const { Text } = Typography;
const { Option } = Select;

interface Props {
    danhSachDiemDen: DiemDen[];
    lichTrinh: LichTrinh;
    setLichTrinh: (val: LichTrinh | ((prev: LichTrinh) => LichTrinh)) => void;
}

const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const TaoLichTrinh = ({ danhSachDiemDen, lichTrinh, setLichTrinh }: Props) => {
    const [themDiemDenId, setThemDiemDenId] = useState<string | undefined>(undefined);
    const [themVaoNgay, setThemVaoNgay] = useState<number>(1);

    const getDiemDen = (id: string) => danhSachDiemDen.find(d => d.id === id);

    const ngayOptions = Array.from({ length: lichTrinh.soNgay }, (_, i) => i + 1);

    const mucTheoNgay: Record<number, MucLichTrinh[]> = {};
    ngayOptions.forEach(n => {
        mucTheoNgay[n] = lichTrinh.cacMuc
            .filter(m => m.ngay === n)
            .sort((a, b) => a.thuTu - b.thuTu);
    });

    const handleXoa = (id: string) => {
        setLichTrinh(lt => ({ ...lt, cacMuc: lt.cacMuc.filter(m => m.id !== id) }));
        message.success('Đã xóa khỏi lịch trình');
    };

    const handleDiChuyen = (muc: MucLichTrinh, huong: 'up' | 'down') => {
        const mucTrongNgay = mucTheoNgay[muc.ngay].slice();
        const idx = mucTrongNgay.findIndex(m => m.id === muc.id);
        if (huong === 'up' && idx === 0) return;
        if (huong === 'down' && idx === mucTrongNgay.length - 1) return;

        const swapIdx = huong === 'up' ? idx - 1 : idx + 1;
        [mucTrongNgay[idx], mucTrongNgay[swapIdx]] = [mucTrongNgay[swapIdx], mucTrongNgay[idx]];

        const capNhatThuTu = mucTrongNgay.map((m, i) => ({ ...m, thuTu: i }));
        const cacMucMoi = lichTrinh.cacMuc.map(m => {
            const cu = capNhatThuTu.find(c => c.id === m.id);
            return cu || m;
        });
        setLichTrinh(lt => ({ ...lt, cacMuc: cacMucMoi }));
    };

    const handleThemTuLichTrinh = () => {
        if (!themDiemDenId) { message.error('Vui lòng chọn điểm đến!'); return; }
        const soMuc = lichTrinh.cacMuc.filter(m => m.ngay === themVaoNgay).length;
        const mucMoi: MucLichTrinh = {
            id: Math.random().toString(36).substr(2, 9),
            diemDenId: themDiemDenId,
            ngay: themVaoNgay,
            thuTu: soMuc,
        };
        setLichTrinh(lt => ({ ...lt, cacMuc: [...lt.cacMuc, mucMoi] }));
        message.success('Đã thêm vào lịch trình');
        setThemDiemDenId(undefined);
    };

    const tongPhiAn = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiAnUong || 0), 0);
    const tongPhiLuu = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiLuuTru || 0), 0);
    const tongPhiDi = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiDiChuyen || 0), 0);
    const tongGio = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.thoiGianThamQuan || 0), 0);
    const tongChi = tongPhiAn + tongPhiLuu + tongPhiDi;

    return (
        <div>
            <Card title="Cấu hình lịch trình" style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <span>Số ngày:</span>&nbsp;
                        <InputNumber
                            min={1} max={30} value={lichTrinh.soNgay}
                            onChange={val => setLichTrinh(lt => ({ ...lt, soNgay: val as number }))}
                        />
                    </Col>
                    <Col>
                        <span>Ngân sách:</span>&nbsp;
                        <InputNumber
                            min={0} step={500000} value={lichTrinh.ngansach}
                            onChange={val => setLichTrinh(lt => ({ ...lt, ngansach: val as number }))}
                            formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            addonAfter="VND"
                            style={{ width: 200 }}
                        />
                    </Col>
                </Row>
            </Card>

            <Card title="Thêm điểm đến" style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Select
                        placeholder="Chọn điểm đến"
                        style={{ width: 250 }}
                        value={themDiemDenId}
                        onChange={setThemDiemDenId}
                        showSearch
                        filterOption={(input, option) =>
                            String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {danhSachDiemDen.map(d => (
                            <Option key={d.id} value={d.id}>{d.ten}</Option>
                        ))}
                    </Select>
                    <Select value={themVaoNgay} onChange={setThemVaoNgay} style={{ width: 120 }}>
                        {ngayOptions.map(n => <Option key={n} value={n}>Ngày {n}</Option>)}
                    </Select>
                    <Button type="primary" onClick={handleThemTuLichTrinh}>
                        Thêm vào lịch
                    </Button>
                </Space>
            </Card>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Tổng điểm đến" value={lichTrinh.cacMuc.length} suffix="điểm" /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Tổng chi phí" value={formatVND(tongChi)} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Tổng thời gian" value={tongGio} suffix="giờ" /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Còn lại ngân sách"
                            value={formatVND(lichTrinh.ngansach - tongChi)}
                            valueStyle={{ color: lichTrinh.ngansach - tongChi >= 0 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            {ngayOptions.map(ngay => {
                const mucTrongNgay = mucTheoNgay[ngay] || [];
                const tongNgay = mucTrongNgay.reduce((sum, m) => {
                    const d = getDiemDen(m.diemDenId);
                    return sum + (d ? d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen : 0);
                }, 0);
                return (
                    <Card
                        key={ngay}
                        title={<span>Ngày {ngay} — Tổng chi: <Text type="danger">{formatVND(tongNgay)}</Text></span>}
                        style={{ marginBottom: 16 }}
                        extra={<Tag color="blue">{mucTrongNgay.length} điểm</Tag>}
                    >
                        {mucTrongNgay.length === 0 ? (
                            <Empty description="Chưa có điểm đến nào trong ngày này" imageStyle={{ height: 40 }} />
                        ) : (
                            mucTrongNgay.map((muc, idx) => {
                                const d = getDiemDen(muc.diemDenId);
                                if (!d) return null;
                                return (
                                    <div key={muc.id}
                                        style={{
                                            display: 'flex', alignItems: 'center',
                                            padding: '8px 12px', marginBottom: 8,
                                            background: '#fafafa', borderRadius: 6,
                                            border: '1px solid #f0f0f0',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Text strong>{d.ten}</Text>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {d.thoiGianThamQuan}h &nbsp;|&nbsp; {formatVND(d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen)}
                                                </Text>
                                            </div>
                                        </div>
                                        <Space>
                                            <Button size="small" icon={<ArrowUpOutlined />} onClick={() => handleDiChuyen(muc, 'up')} disabled={idx === 0} />
                                            <Button size="small" icon={<ArrowDownOutlined />} onClick={() => handleDiChuyen(muc, 'down')} disabled={idx === mucTrongNgay.length - 1} />
                                            <Popconfirm title="Xóa điểm này?" onConfirm={() => handleXoa(muc.id)} okText="Xóa" cancelText="Hủy">
                                                <Button size="small" danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                );
                            })
                        )}
                    </Card>
                );
            })}
        </div>
    );
};

export default TaoLichTrinh;
