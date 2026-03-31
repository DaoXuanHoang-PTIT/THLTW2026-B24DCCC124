import React, { useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, Select, Tag, message, Drawer, List, Typography } from 'antd';
import { Application, Club } from '../index';

const { Text } = Typography;

interface Props {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    clubs: Club[];
}

const QuanLyDonDangKy: React.FC<Props> = ({ applications, setApplications, clubs }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [currentApp, setCurrentApp] = useState<Application | null>(null);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [appToReject, setAppToReject] = useState<Application | 'bulk' | null>(null);

    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [currentHistory, setCurrentHistory] = useState<Application['history']>([]);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || 'Unknown';

    const columns = [
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', sorter: (a: Application, b: Application) => a.fullName.localeCompare(b.fullName) },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Câu lạc bộ',
            dataIndex: 'clubId',
            key: 'clubId',
            render: (id: string) => getClubName(id),
            filters: clubs.map(c => ({ text: c.name, value: c.id })),
            onFilter: (value: string | number | boolean, record: Application) => record.clubId === value,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'Approved' ? 'green' : status === 'Pending' ? 'gold' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value: string | number | boolean, record: Application) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Application) => (
                <Space size="middle">
                    <a onClick={() => { setCurrentApp(record); setIsDetailVisible(true); }}>Chi tiết</a>
                    {record.status === 'Pending' && (
                        <>
                            <a style={{ color: 'green' }} onClick={() => showApproveConfirm([record.id])}>Duyệt</a>
                            <a style={{ color: 'red' }} onClick={() => initiateReject(record)}>Từ chối</a>
                        </>
                    )}
                    <a onClick={() => { setCurrentHistory(record.history); setIsHistoryVisible(true); }}>Lịch sử</a>
                    <a style={{ color: 'red' }} onClick={() => setApplications(applications.filter(a => a.id !== record.id))}>Xóa</a>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const addHistory = (app: Application, action: string, reason?: string) => {
        return {
            ...app,
            history: [
                ...app.history,
                { time: new Date().toISOString(), action, reason }
            ]
        };
    };

    const showApproveConfirm = (ids: string[]) => {
        Modal.confirm({
            title: 'Xác nhận duyệt',
            content: `Bạn có chắc chắn muốn duyệt ${ids.length > 1 ? ids.length + ' đơn này' : 'đơn đăng ký này'}?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                handleApprove(ids);
            },
        });
    };

    const handleApprove = (ids: string[]) => {
        setApplications(apps => apps.map(app => {
            if (ids.includes(app.id) && app.status === 'Pending') {
                return addHistory({ ...app, status: 'Approved' }, `Admin Approved`);
            }
            return app;
        }));
        message.success(`Đã duyệt ${ids.length} đơn đăng ký`);
        setSelectedRowKeys([]);
    };

    const initiateReject = (app: Application | 'bulk') => {
        setAppToReject(app);
        setRejectReason('');
        setIsRejectModalVisible(true);
    };

    const handleRejectExecute = () => {
        if (!rejectReason.trim()) {
            message.error('Bắt buộc nhập lý do từ chối!');
            return;
        }

        if (appToReject === 'bulk') {
            const ids = selectedRowKeys.map(k => k.toString());
            setApplications(apps => apps.map(app => {
                if (ids.includes(app.id) && app.status === 'Pending') {
                    return addHistory({ ...app, status: 'Rejected', note: rejectReason }, `Admin Rejected`, rejectReason);
                }
                return app;
            }));
            message.success(`Đã từ chối ${ids.length} đơn đăng ký`);
            setSelectedRowKeys([]);
        } else if (appToReject) {
            setApplications(apps => apps.map(app => {
                if (app.id === appToReject.id && app.status === 'Pending') {
                    return addHistory({ ...app, status: 'Rejected', note: rejectReason }, `Admin Rejected`, rejectReason);
                }
                return app;
            }));
            message.success(`Đã từ chối đơn của ${appToReject.fullName}`);
        }
        setIsRejectModalVisible(false);
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                    + Thêm đơn đăng ký
                </Button>
                <Button
                    type="primary"
                    disabled={selectedRowKeys.length === 0}
                    onClick={() => showApproveConfirm(selectedRowKeys.map(k => k.toString()))}
                >
                    Duyệt {selectedRowKeys.length} đơn đã chọn
                </Button>
                <Button
                    danger
                    disabled={selectedRowKeys.length === 0}
                    onClick={() => initiateReject('bulk')}
                >
                    Không duyệt {selectedRowKeys.length} đơn đã chọn
                </Button>
            </Space>

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={applications}
                rowKey="id"
            />

            <Drawer
                title="Chi tiết đơn đăng ký"
                placement="right"
                onClose={() => setIsDetailVisible(false)}
                visible={isDetailVisible}
                width={400}
            >
                {currentApp && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <p><strong>Họ tên:</strong> {currentApp.fullName}</p>
                        <p><strong>Email:</strong> {currentApp.email}</p>
                        <p><strong>SĐT:</strong> {currentApp.phone}</p>
                        <p><strong>Giới tính:</strong> {currentApp.gender}</p>
                        <p><strong>Địa chỉ:</strong> {currentApp.address}</p>
                        <p><strong>Sở trường:</strong> {currentApp.strengths}</p>
                        <p><strong>Câu lạc bộ:</strong> {getClubName(currentApp.clubId)}</p>
                        <p><strong>Lý do:</strong> {currentApp.reason}</p>
                        <p><strong>Trạng thái:</strong> <Tag color={currentApp.status === 'Approved' ? 'green' : currentApp.status === 'Pending' ? 'gold' : 'red'}>{currentApp.status}</Tag></p>
                        {currentApp.status === 'Rejected' && <p><strong>Lý do từ chối:</strong> {currentApp.note}</p>}
                    </Space>
                )}
            </Drawer>

            <Modal
                title="Xác nhận từ chối"
                visible={isRejectModalVisible}
                onOk={handleRejectExecute}
                onCancel={() => setIsRejectModalVisible(false)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <Form layout="vertical">
                    <Form.Item label="Lý do từ chối" required>
                        <Input.TextArea
                            rows={4}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Lịch sử thao tác"
                visible={isHistoryVisible}
                footer={null}
                onCancel={() => setIsHistoryVisible(false)}
            >
                <List
                    dataSource={currentHistory}
                    renderItem={item => (
                        <List.Item>
                            <Text type="secondary">[{new Date(item.time).toLocaleString()}]</Text> - {item.action}
                            {item.reason && <Text mark> (Lý do: {item.reason})</Text>}
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal
                title="Tạo đơn đăng ký tham gia CLB"
                visible={isAddModalVisible}
                onOk={() => {
                    addForm.validateFields().then(values => {
                        const newApp: Application = {
                            ...values,
                            id: Math.random().toString(36).substr(2, 9),
                            status: 'Pending',
                            history: [{ time: new Date().toISOString(), action: 'Người dùng nộp đơn' }]
                        };
                        setApplications([...applications, newApp]);
                        setIsAddModalVisible(false);
                        addForm.resetFields();
                        message.success('Đã tạo đơn đăng ký thành công');
                    });
                }}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Tạo đơn"
                cancelText="Hủy"
            >
                <Form form={addForm} layout="vertical">
                    <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập đúng định dạng email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input />
                    </Form.Item>
                    <Form.Item name="strengths" label="Sở trường">
                        <Input />
                    </Form.Item>
                    <Form.Item name="clubId" label="Đăng ký vào Câu lạc bộ" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
                        <Select placeholder="Chọn câu lạc bộ...">
                            {clubs.map((c: Club) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.name} {c.isActive ? '' : '(Ngừng HĐ)'}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="reason" label="Lý do tham gia" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyDonDangKy;
