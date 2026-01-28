import button from '@/locales/vi-VN/global/button';
import title from '@/locales/vi-VN/global/title';
import type { IColumn } from '@/components/Table/typing';
import { Table, Button, Popconfirm, message, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
import { useState } from 'react';
import {Link} from 'umi';

interface sanPham {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const exmpl: sanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
];

function getStatus(quantity: number) {
  if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
  if (quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
  return <Tag color="green">Còn hàng</Tag>;
}

function Bt1() {
  const [data, setData] = useState<sanPham[]>(exmpl);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<sanPham | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const handleSubmit = (values: any) => {
    if (editingItem) {
      setData(data.map(item => (item.id === editingItem.id ? { ...editingItem, ...values } : item)));
      message.success('Cập nhật sản phẩm thành công');
    } else {
      setData([...data, { id: Date.now(), ...values }]);
      message.success('Thêm sản phẩm thành công');
    }
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: IColumn<sanPham>[] = [
    {
      title: 'STT',
      align: 'center',
      render: (_: any, __: sanPham, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      align: 'center',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      align: 'center',
      render: (_: any, record: sanPham) => getStatus(record.quantity),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 220,
      render: (record: sanPham) => (
        <>
          <Button
            onClick={() => {
              setEditingItem(record);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
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
    <div>
      <h2>Quản lý sản phẩm</h2>
      <Link to={"/bt2"}><Button type='primary'>Quản lý đơn hàng</Button></Link>
      <Input.Search
        placeholder="Tìm kiếm theo tên sản phẩm"
        style={{ width: 300, marginBottom: 16 }}
        onChange={e => setSearchText(e.target.value)}
      />

      <Button
        type="primary"
        style={{ float: 'right', marginBottom: 16 }}
        onClick={() => {
          setIsModalOpen(true);
          setEditingItem(null);
          form.resetFields();
        }}
      >
        Thêm sản phẩm
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Laptop">Laptop</Select.Option>
              <Select.Option value="Điện thoại">Điện thoại</Select.Option>
              <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
              <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Bt1;
