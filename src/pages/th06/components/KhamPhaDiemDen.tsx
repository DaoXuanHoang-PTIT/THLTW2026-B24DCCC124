import { useState } from 'react';
import { Row, Col, Card, Rate, Tag, Select, Button, Typography, InputNumber, notification } from 'antd';
import { DiemDen, LichTrinh } from '../index';

const { Text, Title } = Typography;
const { Option } = Select;

interface Props {
    danhSachDiemDen: DiemDen[];
    lichTrinh: LichTrinh;
    setLichTrinh: (val: LichTrinh | ((prev: LichTrinh) => LichTrinh)) => void;
    setDanhSachDiemDen: (val: DiemDen[] | ((prev: DiemDen[]) => DiemDen[])) => void;
}

const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const loaiMau: Record<string, string> = {
    'biển': 'blue',
    'núi': 'green',
    'thành phố': 'purple',
};

const KhamPhaDiemDen = ({ danhSachDiemDen, lichTrinh, setLichTrinh, setDanhSachDiemDen }: Props) => {
    const [filterLoai, setFilterLoai] = useState<string>('all');
    const [filterRating, setFilterRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('rating');
    const [maxTongChi, setMaxTongChi] = useState<number | null>(null);
    const [themVaoNgay, setThemVaoNgay] = useState<number>(1);

    const tongChi = (d: DiemDen) => d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen;

    let filtered = [...danhSachDiemDen];
    if (filterLoai !== 'all') filtered = filtered.filter(d => d.loai === filterLoai);
    if (filterRating > 0) filtered = filtered.filter(d => d.rating >= filterRating);
    if (maxTongChi) filtered = filtered.filter(d => tongChi(d) <= maxTongChi);

    filtered.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return tongChi(a) - tongChi(b);
        if (sortBy === 'price_desc') return tongChi(b) - tongChi(a);
        return 0;
    });

    const handleThem = (diemDen: DiemDen) => {
        const soMucTrongNgay = lichTrinh.cacMuc.filter(m => m.ngay === themVaoNgay).length;
        const mucMoi = {
            id: Math.random().toString(36).substr(2, 9),
            diemDenId: diemDen.id,
            ngay: themVaoNgay,
            thuTu: soMucTrongNgay,
        };
        setLichTrinh(lt => ({ ...lt, cacMuc: [...lt.cacMuc, mucMoi] }));
        setDanhSachDiemDen(ds => ds.map(d => d.id === diemDen.id ? { ...d, luotChon: d.luotChon + 1 } : d));
        notification.success({
            message: 'Đã thêm vào lịch trình!',
            description: `${diemDen.ten} đã được thêm vào Ngày ${themVaoNgay}.`,
            placement: 'bottomRight',
        });
    };

    const ngayOptions = Array.from({ length: lichTrinh.soNgay }, (_, i) => i + 1);

    return (
        <div>
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col>
                        <Select value={filterLoai} onChange={setFilterLoai} style={{ width: 160 }}>
                            <Option value="all">Tất cả loại hình</Option>
                            <Option value="biển">Biển</Option>
                            <Option value="núi">Núi</Option>
                            <Option value="thành phố">Thành phố</Option>
                        </Select>
                    </Col>
                    <Col>
                        <span>Đánh giá tối thiểu:</span> &nbsp;
                        <Rate allowHalf value={filterRating} onChange={setFilterRating} style={{ fontSize: 16 }} />
                    </Col>
                    <Col>
                        <InputNumber
                            placeholder="Tổng chi tối đa (VND)"
                            style={{ width: 200 }}
                            onChange={val => setMaxTongChi(val as number | null)}
                            step={500000}
                            formatter={val => val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                        />
                    </Col>
                    <Col>
                        <Select value={sortBy} onChange={setSortBy} style={{ width: 180 }}>
                            <Option value="rating">Đánh giá cao nhất</Option>
                            <Option value="price_asc">Giá tăng dần</Option>
                            <Option value="price_desc">Giá giảm dần</Option>
                        </Select>
                    </Col>
                    <Col>
                        <span>Thêm vào ngày:</span>&nbsp;
                        <Select value={themVaoNgay} onChange={setThemVaoNgay} style={{ width: 100 }}>
                            {ngayOptions.map(n => <Option key={n} value={n}>Ngày {n}</Option>)}
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                {filtered.map(dest => {
                    const tong = tongChi(dest);
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
                            <Card
                                hoverable
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => handleThem(dest)}
                                        block
                                        style={{ margin: '0 8px', width: 'calc(100% - 16px)' }}
                                    >
                                        Thêm vào Ngày {themVaoNgay}
                                    </Button>,
                                ]}
                                style={{ borderRadius: 8 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Title level={5} style={{ margin: 0 }}>{dest.ten}</Title>
                                    <Tag color={loaiMau[dest.loai]}>{dest.loai.toUpperCase()}</Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                                    {dest.moTa.length > 80 ? dest.moTa.slice(0, 77) + '...' : dest.moTa}
                                </Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Rate disabled allowHalf value={dest.rating} style={{ fontSize: 13 }} />
                                    <Text strong style={{ color: '#f5222d' }}>{formatVND(tong)}</Text>
                                </div>
                                <div style={{ marginTop: 6 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{dest.thoiGianThamQuan} giờ tham quan</Text>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
                {filtered.length === 0 && (
                    <Col span={24} style={{ textAlign: 'center', padding: 40 }}>
                        <Text type="secondary">Không tìm thấy điểm đến phù hợp với bộ lọc.</Text>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default KhamPhaDiemDen;
