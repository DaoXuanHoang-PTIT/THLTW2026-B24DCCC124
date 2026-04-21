import React, { useState } from 'react';
import { Table, Button, Input, Select, Space, Tag, Modal, Form, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Post, Tag as TagType } from '../index';

interface ManagePostsProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    tags: TagType[];
}

const ManagePosts = ({ posts, setPosts, tags }: ManagePostsProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [form] = Form.useForm();

    const filteredPosts = posts.filter(post => {
        const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'All' || post.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
        message.success('Đã xóa bài viết!');
    };

    const handleOpenModal = (post?: Post) => {
        if (post) {
            setEditingPost(post);
            form.setFieldsValue({ ...post });
        } else {
            setEditingPost(null);
            form.resetFields();
            form.setFieldsValue({ status: 'Draft', views: 0 });
        }
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editingPost) {
                setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...values } : p));
                message.success('Đã cập nhật bài viết!');
            } else {
                const newPost: Post = {
                    ...values,
                    id: `p${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    views: 0,
                    author: 'Dao Ho'
                };
                setPosts(prev => [newPost, ...prev]);
                message.success('Đã thêm bài viết mới!');
            }
            setIsModalVisible(false);
        });
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <strong>{text}</strong>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Published' ? 'green' : 'orange'}>
                    {status === 'Published' ? 'Đã đăng' : 'Nháp'}
                </Tag>
            )
        },
        {
            title: 'Thẻ',
            dataIndex: 'tags',
            key: 'tags',
            render: (postTags: string[]) => (
                <>
                    {postTags?.map(tag => (
                        <Tag color="blue" key={tag}>{tag}</Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Post) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size="small" />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa bài viết này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <Space>
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 150 }}
                    >
                        <Select.Option value="All">Tất cả trạng thái</Select.Option>
                        <Select.Option value="Published">Đã đăng</Select.Option>
                        <Select.Option value="Draft">Nháp</Select.Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                    Thêm bài viết
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredPosts}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingPost ? "Sửa bài viết" : "Thêm bài viết mới"}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                        <Input.TextArea rows={8} />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="URL Ảnh đại diện" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="tags" label="Thẻ" rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ' }]}>
                        <Select mode="multiple" placeholder="Chọn thẻ">
                            {tags.map(tag => (
                                <Select.Option key={tag.id} value={tag.name}>{tag.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Select.Option value="Draft">Nháp</Select.Option>
                            <Select.Option value="Published">Đã đăng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagePosts;
