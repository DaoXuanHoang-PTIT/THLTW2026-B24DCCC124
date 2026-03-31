import React, { useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, DatePicker, Select, Tag, Popconfirm, message } from 'antd';
import moment from 'moment';
import { Club } from '../index';

interface Props {
    clubs: Club[];
    setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const DanhSachCauLacBo: React.FC<Props> = ({ clubs, setClubs }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [form] = Form.useForm();


    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <img src={text} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />,
        },
        {
            title: 'Tên câu lạc bộ',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
        },
        {
            title: 'Ngày thành lập',
            dataIndex: 'foundedDate',
            key: 'foundedDate',
            sorter: (a: Club, b: Club) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
        },
        {
            title: 'Chủ nhiệm CLB',
            dataIndex: 'president',
            key: 'president',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Có' : 'Không'}</Tag>
            ),
            filters: [
                { text: 'Có', value: true },
                { text: 'Không', value: false },
            ],
            onFilter: (value: boolean | React.Key, record: Club) => record.isActive === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Club) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>Chỉnh sửa</a>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa CLB này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <a style={{ color: 'red' }}>Xóa</a>
                    </Popconfirm>
                    <a onClick={() => handleViewMembers(record)}>Thành viên</a>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setEditingClub(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Club) => {
        setEditingClub(record);
        form.setFieldsValue({
            ...record,
            foundedDate: record.foundedDate ? moment(record.foundedDate) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        setClubs(clubs.filter(club => club.id !== id));
        message.success('Đã xóa câu lạc bộ');
    };

    const handleViewMembers = (record: Club) => {
        message.info(`Chức năng xem thành viên CLB ${record.name} - Vui lòng chuyển sang tab Thành Viên CLB`);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
            };

            if (editingClub) {
                setClubs(clubs.map(c => c.id === editingClub.id ? { ...editingClub, ...formattedValues } : c));
                message.success('Cập nhật thành công');
            } else {
                setClubs([...clubs, { ...formattedValues, id: Math.random().toString(36).substr(2, 9) }]);
                message.success('Thêm mới thành công');
            }
            setIsModalVisible(false);
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Thêm mới CLB
            </Button>
            <Table columns={columns} dataSource={clubs} rowKey="id" />

            <Modal
                title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm mới CLB'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="avatar" label="Ảnh đại diện (URL)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="president" label="Chủ nhiệm CLB" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="isActive" label="Hoạt động" initialValue={true}>
                        <Select>
                            <Select.Option value={true}>Có</Select.Option>
                            <Select.Option value={false}>Không</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DanhSachCauLacBo;
