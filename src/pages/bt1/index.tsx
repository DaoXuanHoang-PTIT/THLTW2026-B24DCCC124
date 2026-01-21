import button from '@/locales/vi-VN/global/button';
import title from '@/locales/vi-VN/global/title';
import type { IColumn } from '@/components/Table/typing';
import { Table, Button, Popconfirm, message, Modal } from 'antd';
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

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false)
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const columns: IColumn<sanPham>[] = [
    {
      title: 'STT',
      dataIndex:'id',
      align: 'center',
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
          title="Xóa nhé?"
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
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
    />
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      </div>
  );
}

export default Bt1;
