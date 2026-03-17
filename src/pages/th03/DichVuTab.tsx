import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber } from "antd";

interface DichVu {
  id: string;
  ten: string;
  gia: number;
  thoiGian: number;
}

export default function DichVuTab() {
  const [data, setData] = useState<DichVu[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const dv = localStorage.getItem("dichvu");
    if (dv) setData(JSON.parse(dv));
  }, []);

  const save = (values: any) => {
    const newData = { ...values, id: Date.now().toString() };
    const arr = [...data, newData];

    setData(arr);
    localStorage.setItem("dichvu", JSON.stringify(arr));

    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm dịch vụ
      </Button>

      <Table
        style={{ marginTop: 20 }}
        rowKey="id"
        dataSource={data}
        columns={[
          { title: "Tên", dataIndex: "ten" },
          { title: "Giá", dataIndex: "gia" },
          { title: "Thời gian (phút)", dataIndex: "thoiGian" },
        ]}
      />

      <Modal visible={open} onCancel={() => setOpen(false)} footer={null}>
        <Form form={form} onFinish={save}>
          <Form.Item name="ten" rules={[{ required: true }]}>
            <Input placeholder="Tên dịch vụ" />
          </Form.Item>

          <Form.Item name="gia">
            <InputNumber style={{ width: "100%" }} placeholder="Giá" />
          </Form.Item>

          <Form.Item name="thoiGian">
            <InputNumber style={{ width: "100%" }} placeholder="Thời gian" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>
    </>
  );
}