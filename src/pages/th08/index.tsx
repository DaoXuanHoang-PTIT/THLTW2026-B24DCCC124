import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { Dashboard, WorkoutLog, HealthMetrics, GoalsManagement, ExerciseLibrary } from './components';
import { initialWorkouts, initialMetrics, initialGoals, initialExercises } from './mockData';

const { TabPane } = Tabs;
const { Title } = Typography;

const FitnessApp = () => {
    const [workouts, setWorkouts] = useState<any[]>(initialWorkouts);
    const [metrics, setMetrics] = useState<any[]>(initialMetrics);
    const [goals, setGoals] = useState<any[]>(initialGoals);
    const [exercises, setExercises] = useState<any[]>(initialExercises);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, }}>FitTrack - Ứng dụng Thể dục & Sức khỏe</Title>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Tabs defaultActiveKey="1" size="large" type="card">
                    <TabPane tab="Dashboard" key="1">
                        <Dashboard workouts={workouts} metrics={metrics} goals={goals} />
                    </TabPane>
                    <TabPane tab="Nhật ký tập luyện" key="2">
                        <WorkoutLog workouts={workouts} setWorkouts={setWorkouts} />
                    </TabPane>
                    <TabPane tab="Chỉ số sức khỏe" key="3">
                        <HealthMetrics metrics={metrics} setMetrics={setMetrics} />
                    </TabPane>
                    <TabPane tab="Quản lý mục tiêu" key="4">
                        <GoalsManagement goals={goals} setGoals={setGoals} />
                    </TabPane>
                    <TabPane tab="Thư viện bài tập" key="5">
                        <ExerciseLibrary exercises={exercises} setExercises={setExercises} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default FitnessApp;
