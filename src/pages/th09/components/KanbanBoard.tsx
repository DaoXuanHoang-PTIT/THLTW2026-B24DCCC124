import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task, TaskStatus } from '../types';


interface KanbanBoardProps {
    tasks: Task[];
    updateTaskStatus: (id: string, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
    { id: 'Cần làm', title: 'Cần làm' },
    { id: 'Đang làm', title: 'Đang làm' },
    { id: 'Hoàn thành', title: 'Hoàn thành' },
];

const KanbanBoard = ({ tasks, updateTaskStatus, onEdit, onDelete }: KanbanBoardProps) => {
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        updateTaskStatus(draggableId, destination.droppableId as TaskStatus);
    };

    const renderPriorityTag = (priority: string) => {
        let color = priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'gold' : 'green';
        return <Tag color={color}>{priority}</Tag>;
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {columns.map((column) => {
                    const columnTasks = tasks.filter((t) => t.status === column.id);

                    return (
                        <div
                            key={column.id}
                            style={{
                                flex: 1,
                                minWidth: '300px',
                                backgroundColor: '#f0f2f5',
                                borderRadius: '8px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography.Title level={4} style={{ marginBottom: '16px', textAlign: 'center' }}>
                                {column.title} ({columnTasks.length})
                            </Typography.Title>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ flexGrow: 1, minHeight: '100px' }}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginBottom: '12px',
                                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                                        }}
                                                    >
                                                        <Card
                                                            style={{
                                                                borderRadius: '8px',
                                                                boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.1)',
                                                                border: snapshot.isDragging ? '1px solid #1890ff' : '1px solid #f0f0f0'
                                                            }}
                                                            size="small"
                                                            actions={[
                                                                <EditOutlined key="edit" onClick={() => onEdit(task)} />,
                                                                <DeleteOutlined key="delete" style={{ color: 'red' }} onClick={() => onDelete(task.id)} />
                                                            ]}
                                                        >
                                                            <Card.Meta
                                                                title={task.title}
                                                                description={
                                                                    <div>
                                                                        <div style={{ marginBottom: '8px' }}>
                                                                            {renderPriorityTag(task.priority)}
                                                                        </div>
                                                                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                                                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                                                            {dayjs(task.deadline).format('DD/MM/YYYY HH:mm')}
                                                                        </div>
                                                                        <div style={{ marginTop: '8px' }}>
                                                                            {task.tags && task.tags.map(tag => (
                                                                                <Tag key={tag} color="blue" style={{ marginTop: '4px' }}>{tag}</Tag>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            />
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
