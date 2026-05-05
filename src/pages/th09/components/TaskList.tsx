import { useState } from 'react';
import { Table, Tag, Button, Space, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task } from '../types';

const { Option } = Select;

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

    const filteredTasks = tasks.filter((task) => {
        const matchName = task.title.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = filterStatus ? task.status === filterStatus : true;
        return matchName && matchStatus;
    });

    const columns = [
        {
            title: 'Tên Task',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'Cần làm' ? 'blue' : status === 'Đang làm' ? 'orange' : 'green';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                let color = priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'gold' : 'green';
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            sorter: (a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
            render: (deadline: string) => dayjs(deadline).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags: string[]) => (
                <>
                    {tags && tags.map((tag) => (
                        <Tag color="cyan" key={tag}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Task) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 200 }}
                    allowClear
                    onChange={(value) => setFilterStatus(value)}
                >
                    <Option value="Cần làm">Cần làm</Option>
                    <Option value="Đang làm">Đang làm</Option>
                    <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={filteredTasks}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default TaskList;
