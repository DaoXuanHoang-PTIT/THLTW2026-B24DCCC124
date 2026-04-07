import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import KhamPhaDiemDen from './components/KhamPhaDiemDen';
import TaoLichTrinh from './components/TaoLichTrinh';
import QuanLyNganSach from './components/QuanLyNganSach';
import QuanTriAdmin from './components/QuanTriAdmin';

const { TabPane } = Tabs;

export interface DiemDen {
    id: string;
    ten: string;
    loai: 'biển' | 'núi' | 'thành phố';
    moTa: string;
    thoiGianThamQuan: number;
    chiPhiAnUong: number;
    chiPhiLuuTru: number;
    chiPhiDiChuyen: number;
    rating: number;
    hinhAnh: string;
    luotChon: number;
}

export interface MucLichTrinh {
    id: string;
    diemDenId: string;
    ngay: number;
    thuTu: number;
}

export interface LichTrinh {
    id: string;
    ten: string;
    ngayTao: string;
    soNgay: number;
    ngansach: number;
    cacMuc: MucLichTrinh[];
}

export const danhSachDiemDenMacDinh: DiemDen[] = [
    {
        id: 'd1',
        ten: 'Vịnh Hạ Long',
        loai: 'biển',
        moTa: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ, làn nước xanh trong.',
        thoiGianThamQuan: 8,
        chiPhiAnUong: 500000,
        chiPhiLuuTru: 1500000,
        chiPhiDiChuyen: 300000,
        rating: 4.8,
        hinhAnh: '',
        luotChon: 0,
    },
    {
        id: 'd2',
        ten: 'Sapa',
        loai: 'núi',
        moTa: 'Thị trấn trong sương mù với các thửa ruộng bậc thang tuyệt đẹp và văn hóa dân tộc phong phú.',
        thoiGianThamQuan: 12,
        chiPhiAnUong: 400000,
        chiPhiLuuTru: 1200000,
        chiPhiDiChuyen: 500000,
        rating: 4.6,
        hinhAnh: '',
        luotChon: 0,
    },
    {
        id: 'd3',
        ten: 'Đà Nẵng',
        loai: 'thành phố',
        moTa: 'Thành phố biển sôi động với bãi biển Mỹ Khê, cầu Rồng và ẩm thực phong phú.',
        thoiGianThamQuan: 10,
        chiPhiAnUong: 600000,
        chiPhiLuuTru: 1000000,
        chiPhiDiChuyen: 200000,
        rating: 4.9,
        hinhAnh: '',
        luotChon: 0,
    },
    {
        id: 'd4',
        ten: 'Phú Quốc',
        loai: 'biển',
        moTa: 'Đảo ngọc với những bãi biển cát trắng, nước trong xanh và hải sản tươi ngon.',
        thoiGianThamQuan: 24,
        chiPhiAnUong: 800000,
        chiPhiLuuTru: 2000000,
        chiPhiDiChuyen: 400000,
        rating: 4.7,
        hinhAnh: '',
        luotChon: 0,
    },
    {
        id: 'd5',
        ten: 'Đà Lạt',
        loai: 'núi',
        moTa: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thông reo và hoa dã quỳ vàng.',
        thoiGianThamQuan: 16,
        chiPhiAnUong: 500000,
        chiPhiLuuTru: 800000,
        chiPhiDiChuyen: 300000,
        rating: 4.5,
        hinhAnh: '',
        luotChon: 0,
    },
    {
        id: 'd6',
        ten: 'Hội An',
        loai: 'thành phố',
        moTa: 'Phố cổ với đèn lồng rực rỡ, kiến trúc Á Đông cổ kính và ẩm thực đặc sắc miền Trung.',
        thoiGianThamQuan: 8,
        chiPhiAnUong: 450000,
        chiPhiLuuTru: 900000,
        chiPhiDiChuyen: 150000,
        rating: 4.8,
        hinhAnh: '',
        luotChon: 0,
    },
];

export const lichTrinhMauTheoThang: { thang: string; soLuot: number }[] = [
    { thang: 'T1/2025', soLuot: 12 },
    { thang: 'T2/2025', soLuot: 18 },
    { thang: 'T3/2025', soLuot: 25 },
    { thang: 'T4/2025', soLuot: 30 },
    { thang: 'T5/2025', soLuot: 42 },
    { thang: 'T6/2025', soLuot: 55 },
];

const LapKeHoachDuLich = () => {
    const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>(() => {
        const saved = localStorage.getItem('th06_diem_den');
        if (saved) { try { return JSON.parse(saved); } catch (e) { } }
        return danhSachDiemDenMacDinh;
    });

    const [lichTrinh, setLichTrinh] = useState<LichTrinh>(() => {
        const saved = localStorage.getItem('th06_lich_trinh');
        if (saved) { try { return JSON.parse(saved); } catch (e) { } }
        return {
            id: 'lt1',
            ten: 'Chuyến đi đầu tiên',
            ngayTao: new Date().toISOString(),
            soNgay: 3,
            ngansach: 10000000,
            cacMuc: [],
        };
    });

    useEffect(() => {
        localStorage.setItem('th06_diem_den', JSON.stringify(danhSachDiemDen));
    }, [danhSachDiemDen]);

    useEffect(() => {
        localStorage.setItem('th06_lich_trinh', JSON.stringify(lichTrinh));
    }, [lichTrinh]);

    return (
        <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <h1>Ứng Dụng Lập Kế Hoạch Du Lịch</h1>
            <Tabs defaultActiveKey="1" destroyInactiveTabPane>
                <TabPane tab="Khám Phá Điểm Đến" key="1">
                    <KhamPhaDiemDen
                        danhSachDiemDen={danhSachDiemDen}
                        lichTrinh={lichTrinh}
                        setLichTrinh={setLichTrinh}
                        setDanhSachDiemDen={setDanhSachDiemDen}
                    />
                </TabPane>
                <TabPane tab="Tạo Lịch Trình" key="2">
                    <TaoLichTrinh
                        danhSachDiemDen={danhSachDiemDen}
                        lichTrinh={lichTrinh}
                        setLichTrinh={setLichTrinh}
                    />
                </TabPane>
                <TabPane tab="Quản Lý Ngân Sách" key="3">
                    <QuanLyNganSach
                        danhSachDiemDen={danhSachDiemDen}
                        lichTrinh={lichTrinh}
                        setLichTrinh={setLichTrinh}
                    />
                </TabPane>
                <TabPane tab="Quản Trị" key="4">
                    <QuanTriAdmin
                        danhSachDiemDen={danhSachDiemDen}
                        setDanhSachDiemDen={setDanhSachDiemDen}
                        lichTrinh={lichTrinh}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default LapKeHoachDuLich;
