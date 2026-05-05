import { useState } from 'react';
import { Tabs, Button, Typography, Layout, Modal, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTasks } from './useTasks';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './types';

const { Title } = Typography;
const { Content } = Layout;
const { confirm } = Modal;
const { TabPane } = Tabs;

const TH09 = () => {
    const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleAddClick = () => {
        setEditingTask(null);
        setIsFormVisible(true);
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (id: string) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa task này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                deleteTask(id);
                message.success('Đã xóa task thành công');
            },
        });
    };

    const handleFormSubmit = (taskData: Omit<Task, 'id'>) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
            message.success('Cập nhật task thành công');
        } else {
            addTask(taskData);
            message.success('Thêm task thành công');
        }
        setIsFormVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh', padding: '24px' }}>
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: '#fff',
                    borderRadius: '8px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ margin: 0 }}>Quản lý công việc</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick} size="large">
                        Thêm Task
                    </Button>
                </div>

                <Tabs defaultActiveKey="2">
                    <TabPane tab="Dashboard" key="1">
                        <Dashboard tasks={tasks} />
                    </TabPane>
                    <TabPane tab="Kanban Board" key="2">
                        <KanbanBoard
                            tasks={tasks}
                            updateTaskStatus={updateTaskStatus}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </TabPane>
                    <TabPane tab="Danh sách Task" key="3">
                        <TaskList
                            tasks={tasks}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </TabPane>
                </Tabs>

                <TaskForm
                    visible={isFormVisible}
                    onCancel={() => setIsFormVisible(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingTask}
                />
            </Content>
        </Layout>
    );
};

export default TH09;