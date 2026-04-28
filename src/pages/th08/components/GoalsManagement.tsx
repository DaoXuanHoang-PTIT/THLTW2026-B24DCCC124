import React, { useState } from 'react';
import { Button, Card, Col, Drawer, Form, Input, InputNumber, Popconfirm, Progress, Row, Select, Segmented, Space, Tag, Typography, DatePicker } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

interface GoalsManagementProps {
  goals: any[];
  setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const GoalsManagement = ({ goals, setGoals }: GoalsManagementProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang thực hiện': return 'processing';
      case 'Đã đạt': return 'success';
      case 'Đã hủy': return 'error';
      default: return 'default';
    }
  };

  const handleUpdateValue = (id: number, value: string) => {
    const val = parseFloat(value);
    if (!isNaN(val)) {
      setGoals(prev => prev.map(g => {
        if (g.id === id) {
          const updated = { ...g, currentValue: val };
          if ((g.initialValue > g.targetValue && val <= g.targetValue) || 
              (g.initialValue <= g.targetValue && val >= g.targetValue)) {
            updated.status = 'Đã đạt';
          } else if (updated.status === 'Đã đạt') {
            updated.status = 'Đang thực hiện';
          }
          return updated;
        }
        return g;
      }));
    }
  };

  const handleDelete = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newGoal = {
        ...values,
        id: Math.max(0, ...goals.map(g => g.id)) + 1,
        deadline: values.deadline.format('YYYY-MM-DD'),
        currentValue: values.initialValue,
        status: 'Đang thực hiện'
      };
      setGoals(prev => [...prev, newGoal]);
      setIsDrawerVisible(false);
      form.resetFields();
    });
  };

  const filteredGoals = goals.filter(g => filterStatus === 'Tất cả' || g.status === filterStatus);

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          {/* @ts-ignore */}
          <Segmented
            options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
            value={filterStatus}
            onChange={(val) => setFilterStatus(val as string)}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => setIsDrawerVisible(true)}>Thêm mục tiêu</Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filteredGoals.map(g => {
          let progress = 0;
          if (g.initialValue > g.targetValue) {
            progress = ((g.initialValue - g.currentValue) / (g.initialValue - g.targetValue)) * 100;
          } else {
            progress = ((g.currentValue - g.initialValue) / (g.targetValue - g.initialValue)) * 100;
          }
          progress = Math.max(0, Math.min(100, Math.round(progress)));

          return (
            <Col xs={24} sm={12} md={8} xl={6} key={g.id}>
              <Card 
                title={<span style={{fontSize: '16px'}}>{g.name}</span>}
                extra={
                  <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => handleDelete(g.id)}>
                    <Button type="text" danger>Xóa</Button>
                  </Popconfirm>
                }
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <Tag color="cyan" style={{ marginBottom: 12 }}>{g.type}</Tag>
                <Tag color={getStatusColor(g.status)} style={{ float: 'right' }}>
                  {g.status}
                </Tag>
                
                <div style={{ marginBottom: 16, marginTop: 12 }}>
                  <Text type="secondary">Tiến độ:</Text>
                  <Progress percent={progress} status={g.status === 'Đã đạt' ? 'success' : 'active'} strokeColor="#1890ff" />
                </div>
                
                <Row align="middle" justify="space-between" style={{ marginBottom: 12 }}>
                  <Col>
                    <Text type="secondary">Mục tiêu:</Text> <strong>{g.targetValue}</strong>
                  </Col>
                  <Col>
                    <Text type="secondary">Hiện tại:</Text>{' '}
                    <Input 
                      defaultValue={g.currentValue} 
                      size="small" 
                      style={{ width: 60, marginLeft: 4, fontWeight: 'bold' }} 
                      onPressEnter={(e: any) => handleUpdateValue(g.id, e.target.value)}
                      onBlur={(e: any) => handleUpdateValue(g.id, e.target.value)}
                    />
                  </Col>
                </Row>
                
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Deadline: {moment(g.deadline).format('DD/MM/YYYY')}</Text>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer
        title="Thêm mục tiêu mới"
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Hủy</Button>
            <Button onClick={handleAdd} type="primary">Lưu</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}>
            <Input placeholder="Vd: Giảm 2kg, Chạy 10km..." />
          </Form.Item>
          <Form.Item name="type" label="Loại mục tiêu" rules={[{ required: true }]}>
            <Select>
              <Option value="Giảm cân">Giảm cân</Option>
              <Option value="Tăng cơ">Tăng cơ</Option>
              <Option value="Cải thiện sức bền">Cải thiện sức bền</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="initialValue" label="Giá trị hiện tại" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default GoalsManagement;
