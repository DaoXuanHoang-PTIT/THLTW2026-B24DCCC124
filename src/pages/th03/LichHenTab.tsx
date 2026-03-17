import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, InputNumber, DatePicker, message } from "antd";
import dayjs from "dayjs";

interface LichHen {
  id: string;
  ngay: string;
  gio: number;
  idNhanVien: string;
  idDichVu: string;
  trangThai: string;
}

export default function LichHenTab() {
  const [data, setData] = useState<LichHen[]>([]);
  const [nhanVien, setNhanVien] = useState<any[]>([]);
  const [dichVu, setDichVu] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const lh = localStorage.getItem("lichhen");
    const nv = localStorage.getItem("nhanvien");
    const dv = localStorage.getItem("dichvu");

    if (lh) setData(JSON.parse(lh));
    if (nv) setNhanVien(JSON.parse(nv));
    if (dv) setDichVu(JSON.parse(dv));
  }, []);

  const save = (values: any) => {
    const ngay = dayjs(values.ngay).format("YYYY-MM-DD");

    const trung = data.find(
      (i) =>
        i.ngay === ngay &&
        i.gio === values.gio &&
        i.idNhanVien === values.idNhanVien
    );

    if (trung) {
      message.error("Trùng lịch");
      return;
    }

    const newData = {
      id: Date.now().toString(),
      ngay,
      gio: values.gio,
      idNhanVien: values.idNhanVien,
      idDichVu: values.idDichVu,
      trangThai: "Cho duyet",
    };

    const arr = [...data, newData];

    setData(arr);
    localStorage.setItem("lichhen", JSON.stringify(arr));

    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Đặt lịch
      </Button>

      <Table
        style={{ marginTop: 20 }}
        rowKey="id"
        dataSource={data}
        columns={[
          { title: "Ngày", dataIndex: "ngay" },
          { title: "Giờ", dataIndex: "gio" },
          {
            title: "Nhân viên",
            render: (_, r) => nhanVien.find((i) => i.id === r.idNhanVien)?.ten,
          },
          {
            title: "Dịch vụ",
            render: (_, r) => dichVu.find((i) => i.id === r.idDichVu)?.ten,
          },
          { title: "Trạng thái", dataIndex: "trangThai" },
        ]}
      />

      <Modal visible={open} onCancel={() => setOpen(false)} footer={null}>
        <Form form={form} onFinish={save}>
          <Form.Item name="ngay">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gio">
            <InputNumber style={{ width: "100%" }} placeholder="Giờ" />
          </Form.Item>

          <Form.Item name="idNhanVien">
            <Select
              placeholder="Chọn nhân viên"
              options={nhanVien.map((i) => ({
                label: i.ten,
                value: i.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="idDichVu">
            <Select
              placeholder="Chọn dịch vụ"
              options={dichVu.map((i) => ({
                label: i.ten,
                value: i.id,
              }))}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Đặt
          </Button>
        </Form>
      </Modal>
    </>
  );
}