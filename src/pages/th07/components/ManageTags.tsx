import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Space, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Tag as TagType, Post } from '../index';

interface ManageTagsProps {
    tags: TagType[];
    setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
    posts: Post[];
}

const ManageTags = ({ tags, setTags, posts }: ManageTagsProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (tag?: TagType) => {
        if (tag) {
            setEditingTag(tag);
            form.setFieldsValue({ name: tag.name });
        } else {
            setEditingTag(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const tagName = values.name.trim();
            // Kiểm tra trùng tên
            if (tags.some(t => t.name.toLowerCase() === tagName.toLowerCase() && t.id !== editingTag?.id)) {
                message.error('Tên thẻ đã tồn tại!');
                return;
            }

            if (editingTag) {
                setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, name: tagName } : t));
                message.success('Đã cập nhật thẻ!');
                // Optional: Nếu tên thẻ thay đổi, cần cập nhật các bài viết đang dùng thẻ này
                // (Vì trong Post, thẻ được lưu dưới dạng chuỗi tên. Nên có thể phải setPosts)
                // Tuy nhiên trong phạm vi bài toán đơn giản, ta chỉ quan tâm cập nhật thẻ.
            } else {
                setTags(prev => [...prev, { id: `t${Date.now()}`, name: tagName }]);
                message.success('Đã thêm thẻ mới!');
            }
            setIsModalVisible(false);
        });
    };

    const handleDelete = (id: string, name: string) => {
        const isUsed = posts.some(p => p.tags.includes(name));
        if (isUsed) {
            message.error('Không thể xóa thẻ đang được sử dụng trong bài viết!');
            return;
        }
        setTags(prev => prev.filter(t => t.id !== id));
        message.success('Đã xóa thẻ!');
    };

    const columns = [
        {
            title: 'Tên thẻ',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: 'Số bài viết sử dụng',
            key: 'usageCount',
            render: (_: any, record: TagType) => {
                const count = posts.filter(p => p.tags.includes(record.name)).length;
                return <span>{count} bài viết</span>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: TagType) => {
                const isUsed = posts.some(p => p.tags.includes(record.name));
                return (
                    <Space size="middle">
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size="small" />
                        <Popconfirm
                            title="Bạn có chắc muốn xóa thẻ này?"
                            onConfirm={() => handleDelete(record.id, record.name)}
                            okText="Xóa"
                            cancelText="Hủy"
                            disabled={isUsed}
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} size="small" disabled={isUsed} />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                    Thêm thẻ mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tags}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingTag ? "Sửa thẻ" : "Thêm thẻ mới"}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên thẻ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageTags;
