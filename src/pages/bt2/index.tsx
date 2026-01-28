import { Table, Button, Modal, Form, Input, Select, InputNumber, message,Popconfirm } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {Link} from 'umi';
import dayjs from 'dayjs';

interface SanPham {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface SanPhamDonHang {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface DonHang {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: SanPhamDonHang[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const dsSanPhamMacDinh: SanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

function QuanLyDonHang() {
  const [dsSanPham, setDsSanPham] = useState<SanPham[]>([]);
  const [dsDonHang, setDsDonHang] = useState<DonHang[]>([]);
  const [moModal, setMoModal] = useState(false);
  const [moChiTiet, setMoChiTiet] = useState(false);
  const [donDangXem, setDonDangXem] = useState<DonHang | null>(null);
  const [sanPhamChon, setSanPhamChon] = useState<number[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setDsSanPham(JSON.parse(localStorage.getItem('sanPham') || JSON.stringify(dsSanPhamMacDinh)));
    setDsDonHang(JSON.parse(localStorage.getItem('donHang') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('sanPham', JSON.stringify(dsSanPham));
    localStorage.setItem('donHang', JSON.stringify(dsDonHang));
  }, [dsSanPham, dsDonHang]);

  const handleDelete = (id: string) => {
    setDsDonHang(dsDonHang.filter(d => d.id !== id));
    message.success('Xóa đơn hàng thành công');
  };

  const danhSachSanPhamChon = useMemo(() => {
    return sanPhamChon.map(id => dsSanPham.find(s => s.id === id)).filter(Boolean) as SanPham[];
  }, [sanPhamChon, dsSanPham]);

  const soLuongTheoSanPham = Form.useWatch('soLuong', form);

  const tongTien = useMemo(() => {
    if (!soLuongTheoSanPham) return 0;

    return danhSachSanPhamChon.reduce((tong, sp) => {
      const sl = soLuongTheoSanPham[sp.id] || 0;
      return tong + sl * sp.price;
    }, 0);
  }, [soLuongTheoSanPham, danhSachSanPhamChon]);

  const taoDonHang = (giaTri: any) => {
    const sanPham = danhSachSanPhamChon.map(s => ({
      productId: s.id,
      productName: s.name,
      quantity: giaTri.soLuong[s.id],
      price: s.price,
    }));

    const don: DonHang = {
      id: 'DH' + Date.now(),
      customerName: giaTri.customerName,
      phone: giaTri.phone,
      address: giaTri.address,
      products: sanPham,
      totalAmount: tongTien,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setDsDonHang([...dsDonHang, don]);
    setMoModal(false);
    setSanPhamChon([]);
    form.resetFields();
    message.success('Tạo đơn hàng thành công');
  };

  const doiTrangThai = (don: DonHang, trangThaiMoi: string) => {
    if (don.status === trangThaiMoi) return;

    const sanPhamMoi = dsSanPham.map(sp => ({ ...sp }));

    if (don.status !== 'Hoàn thành' && trangThaiMoi === 'Hoàn thành') {
      don.products.forEach(p => {
        const sp = sanPhamMoi.find(s => s.id === p.productId);
        if (sp) sp.quantity -= p.quantity;
      });
    }

    if (don.status === 'Hoàn thành' && trangThaiMoi !== 'Hoàn thành') {
      don.products.forEach(p => {
        const sp = sanPhamMoi.find(s => s.id === p.productId);
        if (sp) sp.quantity += p.quantity;
      });
    }

    setDsSanPham(sanPhamMoi);

    setDsDonHang(dsDonHang.map(d =>
      d.id === don.id ? { ...d, status: trangThaiMoi } : d
    ));
  };

  const cot = [
    { title: 'Mã đơn', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Số SP', render: (_: any, r: DonHang) => r.products.length },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: (t: number) => t.toLocaleString('vi-VN') + ' đ',
      sorter: (a: DonHang, b: DonHang) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      render: (_: any, r: DonHang) => (
        <Select value={r.status} onChange={v => doiTrangThai(r, v)} style={{ width: 130 }}>
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', sorter: (a: DonHang, b: DonHang) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix() },
    {
      title: 'Thao tác',
      render: (_: any, r: DonHang) => (
        <>
        <Button type='primary' onClick={() => { setDonDangXem(r); setMoChiTiet(true); }}>
          Xem
        </Button>

        <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button>
              Xóa
            </Button>
        </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Quản lý đơn hàng</h2>
      <Button type="primary" onClick={() => setMoModal(true)}>Tạo đơn hàng</Button>
      <Link to="/bt1"><><Button type='primary' style={{float: 'right'}}>Quản lý sản phẩm</Button></></Link>
      <Table rowKey="id" columns={cot} dataSource={dsDonHang} />

      <Modal visible={moModal} title="Tạo đơn hàng" onCancel={() => setMoModal(false)} onOk={() => form.submit()} width={700}>
        <Form form={form} layout="vertical" onFinish={taoDonHang}>
          <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, pattern: /^[0-9]{10,11}$/ }]}><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}><Input /></Form.Item>

          <Form.Item label="Sản phẩm" rules={[{ required: true }]}>
            <Select mode="multiple" onChange={setSanPhamChon}>
              {dsSanPham.filter(s => s.quantity > 0).map(s => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {danhSachSanPhamChon.map(s => (
            <Form.Item
              key={s.id}
              name={['soLuong', s.id]}
              label={`Số lượng ${s.name} (tồn: ${s.quantity})`}
              rules={[{ required: true, max: s.quantity, type: 'number' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          ))}

          <h3>Tổng tiền: {tongTien.toLocaleString('vi-VN')} đ</h3>
        </Form>
      </Modal>

      <Modal visible={moChiTiet} footer={null} title="Chi tiết đơn hàng" onCancel={() => setMoChiTiet(false)}>
        {donDangXem && (
          <>
            <p>Khách hàng: {donDangXem.customerName}</p>
            <p>SĐT: {donDangXem.phone}</p>
            <p>Địa chỉ: {donDangXem.address}</p>
            {donDangXem.products.map(p => (
              <p key={p.productId}>{p.productName} x {p.quantity} = {(p.quantity * p.price).toLocaleString('vi-VN')} đ</p>
            ))}
            <h3>Tổng tiền: {donDangXem.totalAmount.toLocaleString('vi-VN')} đ</h3>
          </>
        )}
      </Modal>
    </>
  );
}

export default QuanLyDonHang;
