import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface SoVanBang {
  id: string;
  tenSo: string;
  namCap: number;
  soHienTai: number;
}

const DU_LIEU_SO_MAC_DINH: SoVanBang[] = [
  { id: 'b1', tenSo: 'Sổ VB Năm 2023', namCap: 2023, soHienTai: 520 },
  { id: 'b2', tenSo: 'Sổ VB Năm 2024', namCap: 2024, soHienTai: 15 },
];

const QuanLySoVanBang: React.FC = () => {
  const [danhSachSo, setDanhSachSo] = useState<SoVanBang[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [soDangSua, setSoDangSua] = useState<SoVanBang | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const duLieuDaLuu = localStorage.getItem('th04_soVanBang');
    if (duLieuDaLuu) {
      setDanhSachSo(JSON.parse(duLieuDaLuu));
    } else {
      setDanhSachSo(DU_LIEU_SO_MAC_DINH);
      localStorage.setItem('th04_soVanBang', JSON.stringify(DU_LIEU_SO_MAC_DINH));
    }
  }, []);

  const luuDanhSachSo = (danhSachMoi: SoVanBang[]) => {
    setDanhSachSo(danhSachMoi);
    localStorage.setItem('th04_soVanBang', JSON.stringify(danhSachMoi));
  };

  const moModal = (banGhi?: SoVanBang) => {
    if (banGhi) {
      setSoDangSua(banGhi);
      form.setFieldsValue(banGhi);
    } else {
      setSoDangSua(null);
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xoaSo = (id: string) => {
    const danhSachMoi = danhSachSo.filter((b) => b.id !== id);
    luuDanhSachSo(danhSachMoi);
    message.success('Đã xoá sổ văn bằng!');
  };

  const xuLyLuu = () => {
    form.validateFields().then((giaTri) => {
      if (soDangSua) {
        const danhSachMoi = danhSachSo.map((b) => (b.id === soDangSua.id ? { ...b, ...giaTri } : b));
        luuDanhSachSo(danhSachMoi);
        message.success('Cập nhật thành công!');
      } else {
        const soMoi: SoVanBang = {
          id: Date.now().toString(),
          tenSo: giaTri.tenSo,
          namCap: giaTri.namCap,
          soHienTai: 1
        };
        luuDanhSachSo([...danhSachSo, soMoi]);
        message.success('Mở sổ văn bằng mới thành công!');
      }
      setHienThiModal(false);
    });
  };

  const cotDuLieu = [
    {
      title: 'Tên sổ văn bằng',
      dataIndex: 'tenSo',
      key: 'tenSo',
    },
    {
      title: 'Năm cấp',
      dataIndex: 'namCap',
      key: 'namCap',
      render: (namCap: number) => <Tag color="blue">{namCap}</Tag>,
    },
    {
      title: 'Số văn bằng hiện tại',
      dataIndex: 'soHienTai',
      key: 'soHienTai',
      render: (num: number) => <strong>{num}</strong>,
    },
    {
      title: 'Thao tác',
      key: 'hanhDong',
      render: (_: any, banGhi: SoVanBang) => (
        <Space size="middle">
          <Button onClick={() => moModal(banGhi)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xoá sổ văn bằng này không?" onConfirm={() => xoaSo(banGhi.id)} okText="Xóa" cancelText="Hủy">
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
          Mở Sổ Văn Bằng Mới
        </Button>
      </div>

      <Table dataSource={danhSachSo} columns={cotDuLieu} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal
        title={soDangSua ? 'Sửa sổ văn bằng' : 'Mở sổ văn bằng mới'}
        visible={hienThiModal}
        onOk={xuLyLuu}
        onCancel={() => setHienThiModal(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên sổ" name="tenSo" rules={[{ required: true, message: 'Vui lòng nhập tên sổ!' }]}>
            <Input placeholder="Ví dụ: Sổ VB Năm 2024" />
          </Form.Item>
          <Form.Item label="Năm cấp" name="namCap" rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="2024" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLySoVanBang;
