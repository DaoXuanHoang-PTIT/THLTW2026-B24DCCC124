import { Tabs } from "antd";
import NhanVienTab from "./NhanVienTab";
import DichVuTab from "./DichVuTab";
import LichHenTab from "./LichHenTab";
import DanhGiaTab from "./DanhGiaTab";
import ThongKeTab from "./ThongKeTab";

const { TabPane } = Tabs;

export default function QuanLyDichVu() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Quản lý dịch vụ</h1>

      <Tabs defaultActiveKey="1">

        <TabPane tab="Nhân viên" key="1">
          <NhanVienTab />
        </TabPane>

        <TabPane tab="Dịch vụ" key="2">
          <DichVuTab />
        </TabPane>

        <TabPane tab="Lịch hẹn" key="3">
          <LichHenTab />
        </TabPane>

        <TabPane tab="Đánh giá" key="4">
          <DanhGiaTab />
        </TabPane>

        <TabPane tab="Thống kê" key="5">
          <ThongKeTab />
        </TabPane>

      </Tabs>
    </div>
  );
}