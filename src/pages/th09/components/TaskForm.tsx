import { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import { Task } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface TaskFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (taskData: Omit<Task, 'id'>) => void;
    initialData?: Task | null;
}

const TaskForm = ({ visible, onCancel, onSubmit, initialData }: TaskFormProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialData) {
                form.setFieldsValue({
                    ...initialData,
                    deadline: moment(initialData.deadline),
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSubmit({
                ...values,
                deadline: values.deadline.toISOString(),
            });
            form.resetFields();
        });
    };

    return (
        <Modal
            title={initialData ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
            visible={visible}
            onCancel={onCancel}
            onOk={handleOk}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Tên Task"
                    rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
                >
                    <Input placeholder="Nhập tên task" />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
                </Form.Item>
                <Form.Item
                    name="deadline"
                    label="Deadline"
                    rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime />
                </Form.Item>
                <Form.Item
                    name="priority"
                    label="Mức độ ưu tiên"
                    initialValue="Trung bình"
                >
                    <Select>
                        <Option value="Cao">Cao</Option>
                        <Option value="Trung bình">Trung bình</Option>
                        <Option value="Thấp">Thấp</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Trạng thái"
                    initialValue="Cần làm"
                >
                    <Select>
                        <Option value="Cần làm">Cần làm</Option>
                        <Option value="Đang làm">Đang làm</Option>
                        <Option value="Hoàn thành">Hoàn thành</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select mode="tags" placeholder="Thêm tag cho task">
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskForm;
