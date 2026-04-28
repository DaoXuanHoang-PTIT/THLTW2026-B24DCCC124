import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, Popconfirm, DatePicker, Row, Col, Tag } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface WorkoutLogProps {
  workouts: any[];
  setWorkouts: React.Dispatch<React.SetStateAction<any[]>>;
}

const WorkoutLog = ({ workouts, setWorkouts }: WorkoutLogProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any>(null);

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
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newWorkout = {
        ...values,
        id: editingId !== null ? editingId : Math.max(0, ...workouts.map(w => w.id)) + 1,
        date: values.date.format('YYYY-MM-DD')
      };
      
      if (editingId !== null) {
        setWorkouts(prev => prev.map(w => w.id === editingId ? newWorkout : w));
      } else {
        setWorkouts(prev => [...prev, newWorkout]);
      }
      setIsModalVisible(false);
    });
  };

  const filteredWorkouts = workouts.filter(w => {
    return (
      w.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filterType || w.type === filterType) &&
      (!dateRange || (moment(w.date).isSameOrAfter(dateRange[0]) && moment(w.date).isSameOrBefore(dateRange[1])))
    );
  }).sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());

  const columns = [
    { title: 'Ngày tập', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => moment(a.date).valueOf() - moment(b.date).valueOf() },
    { title: 'Tên bài', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Thời lượng', dataIndex: 'duration', key: 'duration', render: (val: number) => `${val} phút` },
    { title: 'Calo đốt', dataIndex: 'calories', key: 'calories', render: (val: number) => `${val} kcal` },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Hoàn thành' ? 'green' : 'red'}>{status}</Tag> },
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
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input placeholder="Tìm tên bài tập..." value={searchText} onChange={e => setSearchText(e.target.value)} />
        </Col>
        <Col span={5}>
          <Select placeholder="Lọc theo loại" style={{ width: '100%' }} allowClear value={filterType} onChange={setFilterType}>
            <Option value="Cardio">Cardio</Option>
            <Option value="Strength">Strength</Option>
            <Option value="Yoga">Yoga</Option>
            <Option value="HIIT">HIIT</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Col>
        <Col span={8}>
          <RangePicker style={{ width: '100%' }} onChange={dates => setDateRange(dates)} />
        </Col>
        <Col span={5} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleAdd}>Thêm buổi tập</Button>
        </Col>
      </Row>

      <Table dataSource={filteredWorkouts} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal title={editingId ? "Sửa buổi tập" : "Thêm buổi tập mới"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên buổi tập" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
            <Select>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calories" label="Calo đốt" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Bỏ lỡ">Bỏ lỡ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLog;
