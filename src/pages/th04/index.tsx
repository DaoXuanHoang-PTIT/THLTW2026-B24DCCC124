import { Tabs, } from 'antd';
import QuanLySoVanBang from './components/QuanLySoVanBang';
import QuanLyQuyetDinh from './components/QuanLyQuyetDinh';
import CauHinhBieuMau from './components/CauHinhBieuMau';
import ThongTinVanBang from './components/ThongTinVanBang';
import TraCuuVanBang from './components/TraCuuVanBang';

const { TabPane } = Tabs;

const HeThongVanBang = () => {
    return (
        <div style={{ padding: '24px' }}>
            <h1>
                Hệ Thống Quản Lý & Tra Cứu Văn Bằng Tốt Nghiệp
            </h1>

            <Tabs defaultActiveKey="1">

                <TabPane tab="Sổ Văn Bằng" key="1">
                    <QuanLySoVanBang />
                </TabPane>

                <TabPane tab="Quyết Định Tốt Nghiệp" key="2">
                    <QuanLyQuyetDinh />
                </TabPane>

                <TabPane tab="Cấu Hình Biểu Mẫu" key="3">
                    <CauHinhBieuMau />
                </TabPane>

                <TabPane tab="Cấp & Quản Lý Văn Bằng" key="4">
                    <ThongTinVanBang />
                </TabPane>

                <TabPane tab="Tra Cứu Văn Bằng" key="5">
                    <TraCuuVanBang />
                </TabPane>

            </Tabs>
        </div>
    );
};

export default HeThongVanBang;