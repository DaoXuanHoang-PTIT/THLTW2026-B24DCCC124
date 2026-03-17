import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, } from "antd";

interface NhanVien {
  id: string;
  ten: string;
  gioBatDau: number;
  gioKetThuc: number;
  gioiHanNgay: number;
}

export default function NhanVienTab() {
  const [data, setData] = useState<NhanVien[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const nv = localStorage.getItem("nhanvien");
    if (nv) setData(JSON.parse(nv));
  }, []);

  const save = (values: any) => {
    if (editingId) {
      const arr = data.map((item) =>
        item.id === editingId ? { ...item, ...values } : item
      );
      setData(arr);
      localStorage.setItem("nhanvien", JSON.stringify(arr));
      setEditingId(null);
    } else {
      const newData = { ...values, id: Date.now().toString() };
      const arr = [...data, newData];
      setData(arr);
      localStorage.setItem("nhanvien", JSON.stringify(arr));
    }

    setOpen(false);
    form.resetFields();
  };

  const handleEdit = (record: NhanVien) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  return (
    <>
      <Button type="primary" onClick={() => {
        setEditingId(null);
        form.resetFields();
        setOpen(true);
      }}>
        Thêm nhân viên
      </Button>

      <Table
        style={{ marginTop: 20 }}
        rowKey="id"
        dataSource={data}
        columns={[
          { title: "Tên", dataIndex: "ten", width: 150 },
          { title: "Giờ bắt đầu", dataIndex: "gioBatDau", width: 120 },
          { title: "Giờ kết thúc", dataIndex: "gioKetThuc", width: 120 },
          { title: "Giới hạn/ngày", dataIndex: "gioiHanNgay", width: 120 },
          {
            title: "Hành động",
            width: 200,
            render: (_, r) => (
              <>
                <Button onClick={() => handleEdit(r)} style={{ marginRight: 8 }} size="small">
                    Sửa
                </Button>
                <Popconfirm
                  title="Xóa nhân viên này?"
                  onConfirm={() => {
                    const arr = data.filter((i) => i.id !== r.id);
                    setData(arr);
                    localStorage.setItem("nhanvien", JSON.stringify(arr));
                  }}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger size="small"> Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        pagination={{ pageSize: 10 }}
      />

      <Modal visible={open} onCancel={() => setOpen(false)} footer={null} title={editingId ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}>
        <Form form={form} onFinish={save} layout="vertical">
          <Form.Item name="ten" label="Tên nhân viên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item name="gioBatDau" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <InputNumber min={0} max={23} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gioKetThuc" label="Giờ kết thúc" rules={[{ required: true }]}>
            <InputNumber min={0} max={23} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gioiHanNgay" label="Giới hạn khách/ngày" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Button htmlType="submit" type="primary" block>
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
        </Form>
      </Modal>
    </>
  );
}