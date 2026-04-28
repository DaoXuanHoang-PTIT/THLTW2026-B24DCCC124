import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, InputNumber, Popconfirm, DatePicker, Row, Col, Tag, Typography } from 'antd';
import moment from 'moment';

interface HealthMetricsProps {
  metrics: any[];
  setMetrics: React.Dispatch<React.SetStateAction<any[]>>;
}

const getBmiDetails = (weight: number, height: number) => {
  if (!weight || !height) return { bmi: 0, color: 'default', label: 'N/A' };
  const hM = height / 100;
  const bmi = weight / (hM * hM);
  let color = 'default';
  let label = '';

  if (bmi < 18.5) {
    color = 'blue';
    label = 'Thiếu cân';
  } else if (bmi >= 18.5 && bmi < 25) {
    color = 'green';
    label = 'Bình thường';
  } else if (bmi >= 25 && bmi < 30) {
    color = 'gold';
    label = 'Thừa cân';
  } else {
    color = 'red';
    label = 'Béo phì';
  }

  return { bmi: parseFloat(bmi.toFixed(1)), color, label };
};

const HealthMetrics = ({ metrics, setMetrics }: HealthMetricsProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      date: moment(record.date, 'YYYY-MM-DD'),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newMetric = {
        ...values,
        id: editingId !== null ? editingId : Math.max(0, ...metrics.map(m => m.id)) + 1,
        date: values.date.format('YYYY-MM-DD')
      };
      
      if (editingId !== null) {
        setMetrics(prev => prev.map(m => m.id === editingId ? newMetric : m));
      } else {
        setMetrics(prev => [...prev, newMetric]);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => moment(a.date).valueOf() - moment(b.date).valueOf() },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: any) => {
        const { bmi, color, label } = getBmiDetails(record.weight, record.height);
        return <Tag color={color}>{bmi} - {label}</Tag>;
      }
    },
    { title: 'Nhịp tim nghỉ (bpm)', dataIndex: 'restingHeartRate', key: 'restingHeartRate' },
    { title: 'Giờ ngủ', dataIndex: 'sleepHours', key: 'sleepHours' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)} size="small">Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleAdd}>Thêm chỉ số</Button>
        </Col>
      </Row>

      <Table dataSource={[...metrics].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal title={editingId ? "Sửa chỉ số" : "Thêm chỉ số mới"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
                <InputNumber min={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true }]}>
                <InputNumber min={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true }]}>
                <InputNumber min={0} max={24} style={{ width: '100%' }} step={0.5} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthMetrics;
