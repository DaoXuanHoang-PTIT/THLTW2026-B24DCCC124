import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface TruongDuLieu {
  id: string;
  tenTruong: string;
  kieuDuLieu: 'String' | 'Number' | 'Date';
}

const DU_LIEU_MAC_DINH: TruongDuLieu[] = [
  { id: '1', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
  { id: '2', tenTruong: 'Nơi sinh', kieuDuLieu: 'String' },
  { id: '3', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' },
  { id: '4', tenTruong: 'Ngày nhập học', kieuDuLieu: 'Date' },
];

const CauHinhBieuMau: React.FC = () => {
  const [danhSachTruong, setDanhSachTruong] = useState<TruongDuLieu[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [truongDangSua, setTruongDangSua] = useState<TruongDuLieu | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const duLieuDaLuu = localStorage.getItem('th04_cauHinhBieuMau');
    if (duLieuDaLuu) {
      setDanhSachTruong(JSON.parse(duLieuDaLuu));
    } else {
      setDanhSachTruong(DU_LIEU_MAC_DINH);
      localStorage.setItem('th04_cauHinhBieuMau', JSON.stringify(DU_LIEU_MAC_DINH));
    }
  }, []);

  const luuDanhSachTruong = (danhSachMoi: TruongDuLieu[]) => {
    setDanhSachTruong(danhSachMoi);
    localStorage.setItem('th04_cauHinhBieuMau', JSON.stringify(danhSachMoi));
  };

  const moModal = (banGhi?: TruongDuLieu) => {
    if (banGhi) {
      setTruongDangSua(banGhi);
      form.setFieldsValue(banGhi);
    } else {
      setTruongDangSua(null);
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xoaTruong = (id: string) => {
    const danhSachMoi = danhSachTruong.filter((t) => t.id !== id);
    luuDanhSachTruong(danhSachMoi);
    message.success('Đã xoá trường thông tin thành công!');
  };

  const xuLyLuu = () => {
    form.validateFields().then((giaTri) => {
      if (truongDangSua) {
        const danhSachMoi = danhSachTruong.map((t) => (t.id === truongDangSua.id ? { ...t, ...giaTri } : t));
        luuDanhSachTruong(danhSachMoi);
        message.success('Cập nhật thành công!');
      } else {
        const truongMoi = { ...giaTri, id: Date.now().toString() };
        luuDanhSachTruong([...danhSachTruong, truongMoi]);
        message.success('Thêm trường thông tin thành công!');
      }
      setHienThiModal(false);
    });
  };

  const cotDuLieu = [
    {
      title: 'Tên trường thông tin',
      dataIndex: 'tenTruong',
      key: 'tenTruong',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      key: 'kieuDuLieu',
      render: (kieu: string) => {
        let mau = kieu === 'String' ? 'blue' : kieu === 'Number' ? 'green' : 'orange';
        return <Tag color={mau}>{kieu}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'hanhDong',
      render: (_: any, banGhi: TruongDuLieu) => (
        <Space size="middle">
          <Button onClick={() => moModal(banGhi)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xoá?" onConfirm={() => xoaTruong(banGhi.id)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>
          Thêm trường thông tin
        </Button>
      </div>

      <Table dataSource={danhSachTruong} columns={cotDuLieu} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal
        title={truongDangSua ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
        visible={hienThiModal}
        onOk={xuLyLuu}
        onCancel={() => setHienThiModal(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên trường thông tin" name="tenTruong" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: Dân tộc, Nơi sinh,..." />
          </Form.Item>
          <Form.Item label="Kiểu dữ liệu" name="kieuDuLieu" rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}>
            <Select placeholder="Chọn kiểu dữ liệu">
              <Select.Option value="String">String (Chuỗi ký tự)</Select.Option>
              <Select.Option value="Number">Number (Số)</Select.Option>
              <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauHinhBieuMau;
