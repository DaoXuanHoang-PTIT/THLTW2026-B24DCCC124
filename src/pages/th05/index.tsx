import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import DanhSachCauLacBo from './components/DanhSachCauLacBo';
import QuanLyDonDangKy from './components/QuanLyDonDangKy';
import QuanLyThanhVien from './components/QuanLyThanhVien';
import BaoCaoThongKe from './components/BaoCaoThongKe';

const { TabPane } = Tabs;

export interface Club {
    id: string;
    avatar: string;
    name: string;
    foundedDate: string;
    description: string;
    president: string;
    isActive: boolean;
}

export interface HistoryLog {
    time: string;
    action: string;
    reason?: string;
}

export interface Application {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: 'Nam' | 'Nữ' | 'Khác';
    address: string;
    strengths: string;
    clubId: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    note?: string;
    history: HistoryLog[];
}

export const initialClubs: Club[] = [
    {
        id: 'c1',
        avatar: '',
        name: 'CLB Âm Nhạc',
        foundedDate: '2020-05-15',
        description: 'Nơi hội tụ các bạn yêu nhạc',
        president: 'Nguyễn Văn A',
        isActive: true,
    },
    {
        id: 'c2',
        avatar: '',
        name: 'CLB Cầu Lông',
        foundedDate: '2021-08-20',
        description: 'Khỏe để học tập và xây dựng đất nước',
        president: 'Trần Thị B',
        isActive: true,
    },
    {
        id: 'c3',
        avatar: '',
        name: 'CLB Tin Học',
        foundedDate: '2019-10-10',
        description: 'Coding the future',
        president: 'Lê Văn C',
        isActive: false,
    }
];

export const initialApplications: Application[] = [
    {
        id: 'a1',
        fullName: 'Phạm Minh D',
        email: 'phamd@example.com',
        phone: '0987654321',
        gender: 'Nam',
        address: 'Hà Nội',
        strengths: 'Ca hát',
        clubId: 'c1',
        reason: 'Đam mê ca hát từ nhỏ',
        status: 'Pending',
        history: [
            { time: new Date().toISOString(), action: 'Submitted application' }
        ]
    },
    {
        id: 'a2',
        fullName: 'Hoàng Thị E',
        email: 'hoange@example.com',
        phone: '0123456789',
        gender: 'Nữ',
        address: 'Hồ Chí Minh',
        strengths: 'Đánh cầu lông siêu giỏi',
        clubId: 'c2',
        reason: 'Rèn luyện sức khỏe',
        status: 'Approved',
        history: [
            { time: new Date(Date.now() - 86400000).toISOString(), action: 'Submitted application' },
            { time: new Date().toISOString(), action: 'Admin Approved' }
        ]
    },
    {
        id: 'a3',
        fullName: 'Vũ Văn F',
        email: 'vuf@example.com',
        phone: '0345678901',
        gender: 'Nam',
        address: 'Đà Nẵng',
        strengths: 'Thuật toán tốt',
        clubId: 'c3',
        reason: 'Muốn học hỏi thêm',
        status: 'Rejected',
        note: 'Chưa đủ điều kiện tham gia',
        history: [
            { time: new Date(Date.now() - 172800000).toISOString(), action: 'Submitted application' },
            { time: new Date().toISOString(), action: 'Admin Rejected', reason: 'Chưa đủ điều kiện tham gia' }
        ]
    }
];

const QuanLyCauLacBo = () => {
    const [clubs, setClubs] = useState<Club[]>(() => {
        const saved = localStorage.getItem('clubs');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return initialClubs;
    });
    const [applications, setApplications] = useState<Application[]>(() => {
        const saved = localStorage.getItem('applications');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return initialApplications;
    });

    useEffect(() => {
        localStorage.setItem('clubs', JSON.stringify(clubs));
    }, [clubs]);

    useEffect(() => {
        localStorage.setItem('applications', JSON.stringify(applications));
    }, [applications]);

    return (
        <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <h1>Hệ Thống Quản Lý Câu Lạc Bộ</h1>
            <Tabs defaultActiveKey="1" destroyInactiveTabPane>
                <TabPane tab="Danh sách câu lạc bộ" key="1">
                    <DanhSachCauLacBo clubs={clubs} setClubs={setClubs} />
                </TabPane>
                <TabPane tab="Quản lý đơn đăng ký" key="2">
                    <QuanLyDonDangKy applications={applications} setApplications={setApplications} clubs={clubs} />
                </TabPane>
                <TabPane tab="Thành viên CLB" key="3">
                    <QuanLyThanhVien applications={applications} setApplications={setApplications} clubs={clubs} />
                </TabPane>
                <TabPane tab="Báo cáo thống kê" key="4">
                    <BaoCaoThongKe applications={applications} clubs={clubs} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default QuanLyCauLacBo;