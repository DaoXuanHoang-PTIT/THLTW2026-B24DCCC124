import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Timeline, Typography, Tag } from 'antd';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const { Title } = Typography;

interface DashboardProps {
  workouts: any[];
  metrics: any[];
  goals: any[];
}

const Dashboard = ({ workouts, metrics, goals }: DashboardProps) => {
  const completedWorkouts = workouts.filter(w => w.status === 'Hoàn thành' && moment(w.date).isSame(moment(), 'month'));
  const totalWorkoutsMonth = completedWorkouts.length;
  
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
  
  let streak = 0;
  let currentDate = moment().startOf('day');
  let sortedDates = [...new Set(completedWorkouts.map(w => w.date))].sort((a, b) => moment(b).diff(moment(a)));
  
  if (sortedDates.length > 0 && (moment(sortedDates[0]).isSame(currentDate, 'day') || moment(sortedDates[0]).isSame(moment(currentDate).subtract(1, 'day'), 'day'))) {
    let checkDate = moment(sortedDates[0]).startOf('day');
    for (let date of sortedDates) {
      if (moment(date).isSame(checkDate, 'day')) {
        streak++;
        checkDate.subtract(1, 'days');
      } else {
        break;
      }
    }
  }

  const goalProgress = goals.length > 0 ? goals.reduce((sum, g) => {
    let prog = 0;
    if (g.initialValue > g.targetValue) {
      prog = ((g.initialValue - g.currentValue) / (g.initialValue - g.targetValue)) * 100;
    } else {
      prog = ((g.currentValue - g.initialValue) / (g.targetValue - g.initialValue)) * 100;
    }
    return sum + Math.max(0, Math.min(100, prog));
  }, 0) / goals.length : 0;

  const weekData = [0, 0, 0, 0, 0];
  completedWorkouts.forEach(w => {
    const weekOfMonth = Math.ceil(moment(w.date).date() / 7) - 1;
    if (weekOfMonth >= 0 && weekOfMonth < 5) weekData[weekOfMonth]++;
  });

  const barChartOptions: any = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'] },
    colors: ['#1890ff'],
    title: { text: 'Số buổi tập theo tuần' }
  };

  const weightData = [...metrics].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const lineChartOptions: any = {
    chart: { type: 'line', height: 350 },
    stroke: { curve: 'smooth' },
    xaxis: { categories: weightData.map(m => moment(m.date).format('DD/MM')) },
    colors: ['#52c41a'],
    title: { text: 'Biến động cân nặng' }
  };

  const recentWorkouts = [...workouts].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()).slice(0, 5);

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Buổi tập trong tháng" value={totalWorkoutsMonth} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Calo đã đốt" value={totalCalories} suffix="kcal" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Ngày tập liên tiếp" value={streak} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Mục tiêu hoàn thành" value={goalProgress} precision={1} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card>
            <ReactApexChart options={barChartOptions} series={[{ name: 'Số buổi tập', data: weekData }]} type="bar" height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactApexChart options={lineChartOptions} series={[{ name: 'Cân nặng (kg)', data: weightData.map(m => m.weight) }]} type="line" height={300} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              {recentWorkouts.map(w => (
                <Timeline.Item key={w.id} color={w.status === 'Hoàn thành' ? 'green' : 'red'}>
                  <p style={{ margin: 0 }}><strong>{w.date}</strong> - {w.name} {w.status === 'Bỏ lỡ' && <Tag color="error">Bỏ lỡ</Tag>}</p>
                  <p style={{ margin: 0, color: '#888' }}>Loại: <Tag>{w.type}</Tag> | {w.duration} phút | {w.calories} kcal</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
