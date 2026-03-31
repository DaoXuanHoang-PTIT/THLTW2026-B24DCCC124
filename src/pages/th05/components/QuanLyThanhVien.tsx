import React, { useState } from 'react';
import { Space, Table, Button, Modal, Select, message, Tag } from 'antd';
import { Application, Club } from '../index';

interface Props {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    clubs: Club[];
}

const QuanLyThanhVien: React.FC<Props> = ({ applications, setApplications, clubs }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isChangeClubVisible, setIsChangeClubVisible] = useState(false);
    const [targetClubId, setTargetClubId] = useState<string>('');
    const [filterClubId, setFilterClubId] = useState<string | null>(null);

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || 'Unknown';

    // Chỉ lấy những thành viên đã Approved
    const members = applications.filter(app => app.status === 'Approved' && (!filterClubId || app.clubId === filterClubId));

    const columns = [
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        { title: 'Câu lạc bộ', dataIndex: 'clubId', key: 'clubId', render: (id: string) => <Tag color="blue">{getClubName(id)}</Tag> },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const handleExecuteChangeClub = () => {
        if (!targetClubId) {
            message.error('Vui lòng chọn CLB mới!');
            return;
        }

        const ids = selectedRowKeys.map(k => k.toString());
        setApplications(apps => apps.map(app => {
            if (ids.includes(app.id)) {
                return { 
                    ...app, 
                    clubId: targetClubId,
                    history: [
                        ...app.history,
                        { time: new Date().toISOString(), action: `Admin changed club to ${getClubName(targetClubId)}` }
                    ]
                };
            }
            return app;
        }));

        message.success(`Đã chuyển ${ids.length} thành viên sang CLB ${getClubName(targetClubId)}`);
        setIsChangeClubVisible(false);
        setSelectedRowKeys([]);
        setTargetClubId('');
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }} wrap>
                <Select 
                    style={{ width: 250 }} 
                    placeholder="Lọc theo Câu lạc bộ" 
                    allowClear 
                    onChange={value => setFilterClubId(value || null)}
                >
                    {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                </Select>

                <Button 
                    type="primary" 
                    disabled={selectedRowKeys.length === 0} 
                    onClick={() => setIsChangeClubVisible(true)}
                >
                    Đổi Câu lạc bộ cho {selectedRowKeys.length} thành viên
                </Button>
            </Space>

            <Table 
                rowSelection={rowSelection} 
                columns={columns} 
                dataSource={members} 
                rowKey="id" 
            />

            <Modal
                title={`Đổi Câu lạc bộ cho ${selectedRowKeys.length} thành viên`}
                visible={isChangeClubVisible}
                onOk={handleExecuteChangeClub}
                onCancel={() => setIsChangeClubVisible(false)}
                okText="Xác nhận đổi"
            >
                <div style={{ marginBottom: 16 }}>Vui lòng chọn Câu lạc bộ muốn chuyển đến:</div>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn Câu lạc bộ mới"
                    value={targetClubId || undefined}
                    onChange={setTargetClubId}
                >
                    {clubs.map(c => (
                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default QuanLyThanhVien;
