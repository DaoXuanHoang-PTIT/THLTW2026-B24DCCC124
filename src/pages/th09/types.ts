export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';
export type TaskStatus = 'Cần làm' | 'Đang làm' | 'Hoàn thành';

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: TaskPriority;
    status: TaskStatus;
    tags: string[];
}
