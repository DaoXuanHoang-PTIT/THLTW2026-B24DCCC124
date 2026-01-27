import button from '@/locales/vi-VN/global/button';
import title from '@/locales/vi-VN/global/title';
import type { IColumn } from '@/components/Table/typing';
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
} from 'antd';
import { useState } from 'react';

interface sanPham {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const exmpl: sanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

function Bt1() {
  const [data, setData] = useState<sanPham[]>(exmpl);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const handleAdd = (values: any) => {
    const newProduct: sanPham = {
      id: Date.now(),
      ...values,
    };
    setData([...data, newProduct]);
    message.success('Thêm sản phẩm thành công');
    setIsModalOpen(false);
    form.resetFields();
  };

  /* ===== Tìm kiếm ===== */
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  /* ===== Cột bảng ===== */
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
      title: 'Giá',
      dataIndex: 'price',
      align: 'center',
      render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Thao tác',
      width: 200,
      align: 'center',
      render: (record: sanPham) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="primary" danger>
            {button.delete || 'Xóa'}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>{title.product || 'Quản lý sản phẩm'}</h2>

      {/* Tìm kiếm */}
      <Input.Search
        placeholder="Tìm kiếm theo tên sản phẩm"
        style={{ width: 300, marginBottom: 16 }}
        onChange={e => setSearchText(e.target.value)}
      />

      {/* Nút thêm */}
      <Button
        type="primary"
        style={{ float: 'right', marginBottom: 16 }}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm sản phẩm
      </Button>

      {/* Bảng */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
      />

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Bt1;
