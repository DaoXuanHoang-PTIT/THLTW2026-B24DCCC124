import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface QuyetDinh {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: string;
  trichYeu: string;
  idSoVanBang: string;
}

const DU_LIEU_QD_MAC_DINH: QuyetDinh[] = [
  { id: 'd1', soQuyetDinh: '123/QĐ-ĐH', ngayBanHanh: '2023-06-15', trichYeu: 'Quyết định cấp bằng đợt 1 năm 2023', idSoVanBang: 'b1' },
];

const QuanLyQuyetDinh: React.FC = () => {
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinh[]>([]);
  const [danhSachSo, setDanhSachSo] = useState<any[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [quyetDinhDangSua, setQuyetDinhDangSua] = useState<QuyetDinh | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const soDaLuu = localStorage.getItem('th04_soVanBang');
    if (soDaLuu) {
      setDanhSachSo(JSON.parse(soDaLuu));
    }

    const duLieuDaLuu = localStorage.getItem('th04_quyetDinh');
    if (duLieuDaLuu) {
      setDanhSachQuyetDinh(JSON.parse(duLieuDaLuu));
    } else {
      setDanhSachQuyetDinh(DU_LIEU_QD_MAC_DINH);
      localStorage.setItem('th04_quyetDinh', JSON.stringify(DU_LIEU_QD_MAC_DINH));
    }
  }, []);

  const luuDanhSachQuyetDinh = (danhSachMoi: QuyetDinh[]) => {
    setDanhSachQuyetDinh(danhSachMoi);
    localStorage.setItem('th04_quyetDinh', JSON.stringify(danhSachMoi));
  };

  const moModal = (banGhi?: QuyetDinh) => {
    if (banGhi) {
      setQuyetDinhDangSua(banGhi);
      form.setFieldsValue({
        ...banGhi,
        ngayBanHanh: dayjs(banGhi.ngayBanHanh)
      });
    } else {
      setQuyetDinhDangSua(null);
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xoaQuyetDinh = (id: string) => {
    const danhSachMoi = danhSachQuyetDinh.filter((d) => d.id !== id);
    luuDanhSachQuyetDinh(danhSachMoi);
    message.success('Đã xoá quyết định!');
  };

  const xuLyLuu = () => {
    form.validateFields().then((giaTri) => {
      const duLieuQuyetDinh = {
        ...giaTri,
        ngayBanHanh: giaTri.ngayBanHanh.format('YYYY-MM-DD')
      };
      if (quyetDinhDangSua) {
        const danhSachMoi = danhSachQuyetDinh.map((d) => (d.id === quyetDinhDangSua.id ? { ...d, ...duLieuQuyetDinh } : d));
        luuDanhSachQuyetDinh(danhSachMoi);
        message.success('Cập nhật thành công!');
      } else {
        const quyetDinhMoi: QuyetDinh = {
          ...duLieuQuyetDinh,
          id: Date.now().toString()
        };
        luuDanhSachQuyetDinh([...danhSachQuyetDinh, quyetDinhMoi]);
        message.success('Thêm quyết định thành công!');
      }
      setHienThiModal(false);
    });
  };

  const cotDuLieu = [
    {
      title: 'Số QĐ',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
    },
    {
      title: 'Sổ VB liên kết',
      dataIndex: 'idSoVanBang',
      key: 'idSoVanBang',
      render: (idSoVanBang: string) => {
        const so = danhSachSo.find(b => b.id === idSoVanBang);
        return <span>{so ? so.tenSo : 'Không xác định'}</span>;
      }
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
    },
    {
      title: 'Thao tác',
      key: 'hanhDong',
      render: (_: any, banGhi: QuyetDinh) => (
        <Space size="middle">
          <Button onClick={() => moModal(banGhi)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xoá quyết định này không?" onConfirm={() => xoaQuyetDinh(banGhi.id)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button onClick={() => {
          const soDaLuu = localStorage.getItem('th04_soVanBang');
          if (soDaLuu) setDanhSachSo(JSON.parse(soDaLuu));
          const duLieuDaLuu = localStorage.getItem('th04_quyetDinh');
          if (duLieuDaLuu) setDanhSachQuyetDinh(JSON.parse(duLieuDaLuu));
          message.info('Đã tải lại dữ liệu liên kết');
        }}>Làm mới</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>
          Thêm Quyết Định
        </Button>
      </div>

      <Table dataSource={danhSachQuyetDinh} columns={cotDuLieu} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal
        title={quyetDinhDangSua ? 'Sửa Quyết Định' : 'Thêm Quyết Định'}
        visible={hienThiModal}
        onOk={xuLyLuu}
        onCancel={() => setHienThiModal(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Sổ văn bằng" name="idSoVanBang" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}>
            <Select placeholder="Chọn sổ văn bằng" options={danhSachSo.map(b => ({ label: b.tenSo, value: b.id }))} />
          </Form.Item>
          <Form.Item label="Số QĐ" name="soQuyetDinh" rules={[{ required: true, message: 'Vui lòng nhập số QĐ!' }]}>
            <Input placeholder="Ví dụ: 123/QĐ-ĐH" />
          </Form.Item>
          <Form.Item label="Ngày ban hành" name="ngayBanHanh" rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" />
          </Form.Item>
          <Form.Item label="Trích yếu" name="trichYeu" rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}>
            <Input.TextArea placeholder="Nội dung trích yếu của quyết định..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyQuyetDinh;
