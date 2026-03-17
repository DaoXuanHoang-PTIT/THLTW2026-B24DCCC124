import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, Input, Rate } from "antd";

export default function DanhGiaTab() {
  const [data, setData] = useState<any[]>([]);
  const [nhanVien, setNhanVien] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const dg = localStorage.getItem("danhgia");
    const nv = localStorage.getItem("nhanvien");

    if (dg) setData(JSON.parse(dg));
    if (nv) setNhanVien(JSON.parse(nv));
  }, []);

  const save = (values: any) => {
    const newData = { ...values, id: Date.now().toString() };
    const arr = [...data, newData];

    setData(arr);
    localStorage.setItem("danhgia", JSON.stringify(arr));

    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm đánh giá
      </Button>

      <Table
        style={{ marginTop: 20 }}
        rowKey="id"
        dataSource={data}
        columns={[
          {
            title: "Nhân viên",
            render: (_, r) => nhanVien.find((i) => i.id === r.idNhanVien)?.ten,
          },
          { title: "Sao", render: (_, r) => <Rate disabled value={r.soSao} /> },
          { title: "Nội dung", dataIndex: "noiDung" },
        ]}
      />

      <Modal visible={open} onCancel={() => setOpen(false)} footer={null}>
        <Form form={form} onFinish={save}>
          <Form.Item name="idNhanVien">
            <Select
              options={nhanVien.map((i) => ({
                label: i.ten,
                value: i.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="soSao">
            <Rate />
          </Form.Item>

          <Form.Item name="noiDung">
            <Input placeholder="Nội dung" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form>
      </Modal>
    </>
  );
}