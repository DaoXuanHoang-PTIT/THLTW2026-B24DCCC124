import { useState, useEffect } from "react";
import { Input, Button, Select, InputNumber, Table, message, Popconfirm, Modal, Form, Progress } from "antd";

interface MonHoc {
  id: string;
  ten: string;
}

interface LichHoc {
  id: string;
  idMonHoc: string;
  thoiGian: string;
  thoiLuong: number;
}

interface MucTieu {
  idMonHoc: string;
  thoiLuongMucTieu: number;
}

function QuanLyHocTap() {
  const [form] = Form.useForm();

  const [danhSachMon, setDanhSachMon] = useState<MonHoc[]>(() => {
    const data = localStorage.getItem("danhSachMon");
    return data
      ? JSON.parse(data)
      : [
          { id: "1", ten: "Toán" },
          { id: "2", ten: "Văn" },
          { id: "3", ten: "Anh" },
        ];
  });

  const [danhSachLich, setDanhSachLich] = useState<LichHoc[]>(() => {
    const data = localStorage.getItem("danhSachLich");
    return data ? JSON.parse(data) : [];
  });

  const [danhSachMucTieu, setDanhSachMucTieu] = useState<MucTieu[]>(() => {
    const data = localStorage.getItem("mucTieu");
    return data ? JSON.parse(data) : [];
  });

  const [tenMonMoi, setTenMonMoi] = useState("");
  const [idMonChon, setIdMonChon] = useState<string>();
  const [thoiGianHoc, setThoiGianHoc] = useState("");
  const [thoiLuongHoc, setThoiLuongHoc] = useState<number>(0);

  const [idMonMucTieu, setIdMonMucTieu] = useState<string>();
  const [thoiLuongMucTieuMoi, setThoiLuongMucTieuMoi] = useState<number>(0);

  const [editing, setEditing] = useState<LichHoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("danhSachMon", JSON.stringify(danhSachMon));
  }, [danhSachMon]);

  useEffect(() => {
    localStorage.setItem("danhSachLich", JSON.stringify(danhSachLich));
  }, [danhSachLich]);

  useEffect(() => {
    localStorage.setItem("mucTieu", JSON.stringify(danhSachMucTieu));
  }, [danhSachMucTieu]);

  const themMon = () => {
    if (!tenMonMoi.trim()) return message.error("Nhập tên môn");

    setDanhSachMon([
      ...danhSachMon,
      { id: Date.now().toString(), ten: tenMonMoi },
    ]);

    setTenMonMoi("");
  };

  const xoaMon = (id: string) => {
    setDanhSachMon(danhSachMon.filter((m) => m.id !== id));
    setDanhSachLich(danhSachLich.filter((l) => l.idMonHoc !== id));
  };

  const themLich = () => {
    if (!idMonChon || !thoiGianHoc || !thoiLuongHoc)
      return message.error("Nhập đủ thông tin");

    const lichMoi: LichHoc = {
      id: Date.now().toString(),
      idMonHoc: idMonChon,
      thoiGian: thoiGianHoc,
      thoiLuong: thoiLuongHoc,
    };

    setDanhSachLich([...danhSachLich, lichMoi]);

    message.success("Đã thêm lịch học");
  };

  const xoaLich = (id: string) => {
    setDanhSachLich(danhSachLich.filter((l) => l.id !== id));
  };

  const moSua = (record: LichHoc) => {
    setEditing(record);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };

  const luuSua = () => {
    form.validateFields().then((values) => {
      const newList = danhSachLich.map((l) =>
        l.id === editing?.id ? { ...l, ...values } : l
      );

      setDanhSachLich(newList);
      setIsModalOpen(false);
      setEditing(null);

      message.success("Đã cập nhật");
    });
  };

  const themMucTieu = () => {
    if (!idMonMucTieu || !thoiLuongMucTieuMoi)
      return message.error("Nhập mục tiêu");

    const exist = danhSachMucTieu.find((m) => m.idMonHoc === idMonMucTieu);

    if (exist) {
      const newList = danhSachMucTieu.map((m) =>
        m.idMonHoc === idMonMucTieu
          ? { ...m, thoiLuongMucTieu: thoiLuongMucTieuMoi }
          : m
      );
      setDanhSachMucTieu(newList);
    } else {
      setDanhSachMucTieu([
        ...danhSachMucTieu,
        {
          idMonHoc: idMonMucTieu,
          thoiLuongMucTieu: thoiLuongMucTieuMoi,
        },
      ]);
    }

    message.success("Đã đặt mục tiêu");
  };

  const tinhTongPhut = (idMon: string) => {
    return danhSachLich
      .filter((l) => l.idMonHoc === idMon)
      .reduce((sum, l) => sum + l.thoiLuong, 0);
  };

  const columns = [
    {
      title: "Môn",
      render: (r: LichHoc) =>
        danhSachMon.find((m) => m.id === r.idMonHoc)?.ten,
    },
    {
      title: "Thời gian",
      render: (r: LichHoc) => new Date(r.thoiGian).toLocaleString(),
    },
    {
      title: "Phút",
      dataIndex: "thoiLuong",
    },
    {
      title: "Thao tác",
      render: (r: LichHoc) => (
        <>
          <Button onClick={() => moSua(r)} style={{ marginRight: 8 }}>
            Sửa
          </Button>

          <Popconfirm title="Xóa lịch?" onConfirm={() => xoaLich(r.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 30 }}>
      <h2>Danh mục môn học</h2>

      <Input
        placeholder="Tên môn"
        value={tenMonMoi}
        onChange={(e) => setTenMonMoi(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />

      <Button type="primary" onClick={themMon}>
        Thêm
      </Button>

      <ul>
        {danhSachMon.map((m) => (
          <li key={m.id}>
            {m.ten}
            <Button
              danger
              size="small"
              onClick={() => xoaMon(m.id)}
              style={{ marginLeft: 10 }}
            >
              Xóa
            </Button>
          </li>
        ))}
      </ul>

      <h2>Thêm lịch học</h2>

      <Select
        placeholder="Chọn môn"
        style={{ width: 200 }}
        onChange={setIdMonChon}
      >
        {danhSachMon.map((m) => (
          <Select.Option key={m.id} value={m.id}>
            {m.ten}
          </Select.Option>
        ))}
      </Select>

      <Input
        type="datetime-local"
        style={{ width: 220, marginLeft: 10 }}
        onChange={(e) => setThoiGianHoc(e.target.value)}
      />

      <InputNumber
        placeholder="Phút"
        style={{ marginLeft: 10 }}
        onChange={(v) => setThoiLuongHoc(v || 0)}
      />

      <Button type="primary" onClick={themLich} style={{ marginLeft: 10 }}>
        Lưu
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={danhSachLich}
        style={{ marginTop: 20 }}
      />

      <h2>Mục tiêu học tập</h2>

      <Select
        placeholder="Chọn môn"
        style={{ width: 200 }}
        onChange={setIdMonMucTieu}
      >
        {danhSachMon.map((m) => (
          <Select.Option key={m.id} value={m.id}>
            {m.ten}
          </Select.Option>
        ))}
      </Select>

      <InputNumber
        placeholder="Phút mục tiêu"
        style={{ marginLeft: 10 }}
        onChange={(v) => setThoiLuongMucTieuMoi(v || 0)}
      />

      <Button type="primary" onClick={themMucTieu} style={{ marginLeft: 10 }}>
        Lưu mục tiêu
      </Button>

      <div style={{ marginTop: 20 }}>
        {danhSachMucTieu.map((m) => {
          const mon = danhSachMon.find((x) => x.id === m.idMonHoc)?.ten;
          const tong = tinhTongPhut(m.idMonHoc);
          const percent = Math.min(
            Math.round((tong / m.thoiLuongMucTieu) * 100),
            100
          );

          return (
            <div key={m.idMonHoc} style={{ marginBottom: 10 }}>
              {mon}: {tong}/{m.thoiLuongMucTieu} phút
              <Progress percent={percent} />
            </div>
          );
        })}
      </div>

      <Modal
        title="Sửa lịch học"
        visible={isModalOpen}
        onOk={luuSua}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="idMonHoc" label="Môn">
            <Select>
              {danhSachMon.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="thoiGian" label="Thời gian">
            <Input type="datetime-local" />
          </Form.Item>

          <Form.Item name="thoiLuong" label="Thời lượng">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default QuanLyHocTap;