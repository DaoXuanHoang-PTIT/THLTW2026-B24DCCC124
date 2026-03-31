import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { Application, Club } from '../index';

interface Props {
    applications: Application[];
    clubs: Club[];
}

const BaoCaoThongKe: React.FC<Props> = ({ applications, clubs }) => {
    const totalClubs = clubs.length;
    const pendingApps = applications.filter(a => a.status === 'Pending').length;
    const approvedApps = applications.filter(a => a.status === 'Approved').length;
    const rejectedApps = applications.filter(a => a.status === 'Rejected').length;

    const categories = clubs.map(c => c.name);
    const dataPending = clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Pending').length);
    const dataApproved = clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Approved').length);
    const dataRejected = clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Rejected').length);

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { type: 'bar', height: 350 },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories },
        yaxis: { title: { text: 'Số lượng đơn' } },
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: (val) => `${val} đơn` }
        },
        colors: ['#faad14', '#52c41a', '#f5222d'],
    };

    const chartSeries = [
        { name: 'Pending', data: dataPending },
        { name: 'Approved', data: dataApproved },
        { name: 'Rejected', data: dataRejected },
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card><Statistic title="Tổng số Câu lạc bộ" value={totalClubs} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Pending" value={pendingApps} valueStyle={{ color: '#faad14' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Approved" value={approvedApps} valueStyle={{ color: '#52c41a' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Rejected" value={rejectedApps} valueStyle={{ color: '#f5222d' }} /></Card>
                </Col>
            </Row>

            <Card title="Thống kê đơn đăng ký theo Câu lạc bộ">
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={400} />
            </Card>
        </div>
    );
};

export default BaoCaoThongKe;
