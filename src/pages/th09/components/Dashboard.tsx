import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { Task } from '../types';

interface DashboardProps {
    tasks: Task[];
}

const Dashboard = ({ tasks }: DashboardProps) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Hoàn thành').length;
    const overdueTasks = tasks.filter(
        (t) => t.status !== 'Hoàn thành' && new Date(t.deadline) < new Date()
    ).length;

    return (
        <div style={{ padding: '20px 0' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card style={{ backgroundColor: '#e6f7ff', borderRadius: '10px' }}>
                        <Statistic
                            title="Tổng số Task"
                            value={totalTasks}
                            prefix={<ProfileOutlined />}
                            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ backgroundColor: '#f6ffed', borderRadius: '10px' }}>
                        <Statistic
                            title="Task Hoàn Thành"
                            value={completedTasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ backgroundColor: '#fff1f0', borderRadius: '10px' }}>
                        <Statistic
                            title="Task Quá Hạn"
                            value={overdueTasks}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#f5222d', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
