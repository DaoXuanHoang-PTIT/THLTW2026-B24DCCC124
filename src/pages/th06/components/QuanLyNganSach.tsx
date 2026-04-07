import { Row, Col, Card, Statistic, Typography, Alert, InputNumber, Space } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { DiemDen, LichTrinh } from '../index';

const { Text } = Typography;

interface Props {
    danhSachDiemDen: DiemDen[];
    lichTrinh: LichTrinh;
    setLichTrinh: (val: LichTrinh | ((prev: LichTrinh) => LichTrinh)) => void;
}

const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const QuanLyNganSach = ({ danhSachDiemDen, lichTrinh, setLichTrinh }: Props) => {
    const getDiemDen = (id: string) => danhSachDiemDen.find(d => d.id === id);

    const tongAnUong = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiAnUong || 0), 0);
    const tongLuuTru = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiLuuTru || 0), 0);
    const tongDiChuyen = lichTrinh.cacMuc.reduce((sum, m) => sum + (getDiemDen(m.diemDenId)?.chiPhiDiChuyen || 0), 0);
    const tongChi = tongAnUong + tongLuuTru + tongDiChuyen;
    const vuotNganSach = tongChi > lichTrinh.ngansach;
    const conLai = lichTrinh.ngansach - tongChi;
    const phanTramDung = lichTrinh.ngansach > 0 ? Math.min(Math.round((tongChi / lichTrinh.ngansach) * 100), 100) : 0;

    const donutOptions: ApexCharts.ApexOptions = {
        chart: { type: 'donut' },
        labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
        colors: ['#52c41a', '#1890ff', '#faad14'],
        legend: { position: 'bottom' },
        tooltip: { y: { formatter: (val) => formatVND(val) } },
        responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }],
    };
    const donutSeries = [tongAnUong, tongLuuTru, tongDiChuyen];

    const ngayList = Array.from({ length: lichTrinh.soNgay }, (_, i) => i + 1);
    const chiPhiTheoNgay = ngayList.map(ngay => {
        const mucNgay = lichTrinh.cacMuc.filter(m => m.ngay === ngay);
        return mucNgay.reduce((sum, m) => {
            const d = getDiemDen(m.diemDenId);
            return sum + (d ? d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen : 0);
        }, 0);
    });

    const barOptions: ApexCharts.ApexOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: ngayList.map(n => `Ngày ${n}`) },
        yaxis: { title: { text: 'Chi phí (VND)' }, labels: { formatter: val => (val / 1000000).toFixed(1) + 'M' } },
        colors: ['#1890ff'],
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: val => formatVND(val) } },
        plotOptions: { bar: { borderRadius: 4 } },
    };
    const barSeries = [{ name: 'Chi phí', data: chiPhiTheoNgay }];

    const radialOptions: ApexCharts.ApexOptions = {
        chart: { type: 'radialBar' },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: { show: true, fontSize: '16px' },
                    value: { show: true, fontSize: '22px', formatter: val => `${val}%` },
                },
            },
        },
        labels: [vuotNganSach ? 'Vượt ngân sách!' : 'Trong ngân sách'],
        colors: [vuotNganSach ? '#f5222d' : '#52c41a'],
    };
    const radialSeries = [phanTramDung];

    return (
        <div>
            {vuotNganSach && (
                <Alert
                    type="error"
                    showIcon
                    message="Vượt ngân sách!"
                    description={`Bạn đã vượt quá ngân sách ${formatVND(Math.abs(conLai))}. Hãy điều chỉnh lịch trình hoặc tăng ngân sách.`}
                    style={{ marginBottom: 16 }}
                />
            )}
            {!vuotNganSach && tongChi > 0 && phanTramDung >= 80 && (
                <Alert
                    type="warning"
                    showIcon
                    message="Sắp vượt ngân sách"
                    description={`Bạn đã sử dụng ${phanTramDung}% ngân sách. Còn lại ${formatVND(conLai)}.`}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Card style={{ marginBottom: 16 }}>
                <Space align="center">
                    <Text strong>Thiết lập ngân sách:</Text>
                    <InputNumber
                        min={0}
                        step={500000}
                        value={lichTrinh.ngansach}
                        onChange={val => setLichTrinh(lt => ({ ...lt, ngansach: val as number }))}
                        formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        addonAfter="VND"
                        style={{ width: 220 }}
                    />
                </Space>
            </Card>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Ăn uống" value={formatVND(tongAnUong)} valueStyle={{ fontSize: 16 }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Lưu trú" value={formatVND(tongLuuTru)} valueStyle={{ fontSize: 16 }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card><Statistic title="Di chuyển" value={formatVND(tongDiChuyen)} valueStyle={{ fontSize: 16 }} /></Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Còn lại"
                            value={formatVND(conLai)}
                            valueStyle={{ fontSize: 16, color: vuotNganSach ? '#f5222d' : '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={10}>
                    <Card title="Phân bổ ngân sách theo hạng mục">
                        {tongChi > 0 ? (
                            <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={320} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <Text type="secondary">Chưa có dữ liệu chi phí. Thêm điểm đến vào lịch trình để xem biểu đồ.</Text>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="% Ngân sách đã sử dụng">
                        <ReactApexChart options={radialOptions} series={radialSeries} type="radialBar" height={320} />
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card title="Chi phí theo ngày">
                        {chiPhiTheoNgay.some(v => v > 0) ? (
                            <ReactApexChart options={barOptions} series={barSeries} type="bar" height={320} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <Text type="secondary">Chưa có dữ liệu</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default QuanLyNganSach;
