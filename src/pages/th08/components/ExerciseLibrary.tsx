import React, { useState } from 'react';
import { Card, Col, Row, Input, Select, Tag, Button, Modal, Typography, Form, InputNumber } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;

interface ExerciseLibraryProps {
  exercises: any[];
  setExercises: React.Dispatch<React.SetStateAction<any[]>>;
}

const difficultyColor = {
  'Dễ': 'green',
  'Trung bình': 'orange',
  'Khó': 'red',
};

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const difficulties = ['Dễ', 'Trung bình', 'Khó'];

const ExerciseLibrary = ({ exercises, setExercises }: ExerciseLibraryProps) => {
  const [searchText, setSearchText] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
  const [filterDiff, setFilterDiff] = useState<string | undefined>(undefined);

  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleCardClick = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDetailModalVisible(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsFormModalVisible(true);
  };

  const handleEdit = (exercise: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(exercise.id);
    form.setFieldsValue(exercise);
    setIsFormModalVisible(true);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleFormOk = () => {
    form.validateFields().then(values => {
      const newExercise = {
        ...values,
        id: editingId !== null ? editingId : Math.max(0, ...exercises.map(ex => ex.id)) + 1,
      };
      if (editingId !== null) {
        setExercises(prev => prev.map(ex => ex.id === editingId ? newExercise : ex));
      } else {
        setExercises(prev => [...prev, newExercise]);
      }
      setIsFormModalVisible(false);
    });
  };

  const filteredExercises = exercises.filter(ex => {
    return (
      ex.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filterMuscle || ex.muscleGroup === filterMuscle) &&
      (!filterDiff || ex.difficulty === filterDiff)
    );
  });

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Input 
            placeholder="Tìm kiếm bài tập..." 
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
          />
        </Col>
        <Col xs={12} md={5}>
          <Select placeholder="Nhóm cơ" style={{ width: '100%' }} allowClear onChange={setFilterMuscle} value={filterMuscle}>
            {muscleGroups.map(g => <Option key={g} value={g}>{g}</Option>)}
          </Select>
        </Col>
        <Col xs={12} md={5}>
          <Select placeholder="Mức độ" style={{ width: '100%' }} allowClear onChange={setFilterDiff} value={filterDiff}>
            {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
          </Select>
        </Col>
        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleAdd}>Thêm bài tập</Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {filteredExercises.map(ex => (
          <Col xs={24} sm={12} md={8} key={ex.id}>
            <Card 
              hoverable 
              onClick={() => handleCardClick(ex)}
              actions={[
                <span key="edit" onClick={(e) => handleEdit(ex, e)}>Sửa</span>,
                <span key="delete" style={{ color: 'red' }} onClick={(e) => {
                  Modal.confirm({
                    title: 'Xóa bài tập này?',
                    onOk: () => handleDelete(ex.id, e)
                  });
                }}>Xóa</span>
              ]}
              style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Meta 
                title={<span style={{ fontSize: '18px' }}>{ex.name}</span>}
                description={
                  <div style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{ex.muscleGroup}</Tag>
                      <Tag color={(difficultyColor as any)[ex.difficulty]}>{ex.difficulty}</Tag>
                    </div>
                    <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 8 }}>
                      {ex.description}
                    </Paragraph>
                    <Text strong style={{ color: '#fa8c16' }}>~{ex.caloriesPerHour} kcal/giờ</Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal 
        title={selectedExercise?.name} 
        visible={isDetailModalVisible} 
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[ <Button key="close" type="primary" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button> ]}
      >
        {selectedExercise && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedExercise.muscleGroup}</Tag>
              <Tag color={(difficultyColor as any)[selectedExercise.difficulty]}>{selectedExercise.difficulty}</Tag>
            </div>
            <Title level={5}>Mô tả chi tiết:</Title>
            <Paragraph>{selectedExercise.description}</Paragraph>
            <Title level={5}>Lượng calo đốt trung bình:</Title>
            <Paragraph><Text strong type="warning">{selectedExercise.caloriesPerHour} kcal / giờ</Text></Paragraph>
            <Title level={5}>Hướng dẫn thực hiện:</Title>
            <Paragraph>
              1. Chuẩn bị tư thế sẵn sàng.<br/>
              2. Thực hiện động tác theo đúng kỹ thuật form.<br/>
              3. Giữ nhịp thở đều đặn.<br/>
              4. Lặp lại số lần quy định cho mỗi hiệp.
            </Paragraph>
          </div>
        )}
      </Modal>

      <Modal
        title={editingId ? "Sửa bài tập" : "Thêm bài tập mới"}
        visible={isFormModalVisible}
        onOk={handleFormOk}
        onCancel={() => setIsFormModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true }]}>
                <Select>
                  {muscleGroups.map(g => <Option key={g} value={g}>{g}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true }]}>
                <Select>
                  {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="caloriesPerHour" label="Calo đốt trung bình / giờ" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;
