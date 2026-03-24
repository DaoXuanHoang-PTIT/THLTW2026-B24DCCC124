import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, DatePicker, Row, Col, Card, message, Typography, Descriptions, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface ThamSoTimKiem {
  soHieuVanBang?: string;
  soVaoSo?: string;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: dayjs.Dayjs;
}

const TraCuuVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [ketQuaTimKiem, setKetQuaTimKiem] = useState<any[]>([]);
  const [danhSachVanBang, setDanhSachVanBang] = useState<any[]>([]);
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<any[]>([]);
  const [luotTraCuu, setLuotTraCuu] = useState<Record<string, number>>({});
  const [xemChiTiet, setXemChiTiet] = useState<any>(null);

  useEffect(() => {
    const vanBangDaLuu = localStorage.getItem('th04_vanBang');
    if (vanBangDaLuu) setDanhSachVanBang(JSON.parse(vanBangDaLuu));

    const quyetDinhDaLuu = localStorage.getItem('th04_quyetDinh');
    if (quyetDinhDaLuu) setDanhSachQuyetDinh(JSON.parse(quyetDinhDaLuu));

    const luotTraCuuDaLuu = localStorage.getItem('th04_bangTraCuu');
    if (luotTraCuuDaLuu) setLuotTraCuu(JSON.parse(luotTraCuuDaLuu));
  }, []);

  const xuLyTraCuu = () => {
    form.validateFields().then((giaTri: ThamSoTimKiem) => {
      const thamSoDuocNhap = [
        giaTri.soHieuVanBang,
        giaTri.soVaoSo,
        giaTri.maSinhVien,
        giaTri.hoTen,
        giaTri.ngaySinh
      ];

      const soThamSoBiTrong = thamSoDuocNhap.filter(val => val && val.toString().trim() !== '').length;

      if (soThamSoBiTrong < 2) {
        message.error('Vui lòng nhập ít nhất 2 tham số để tìm kiếm!');
        return;
      }

      const danhSachKetQua = danhSachVanBang.filter(d => {
        let khopDuLieu = true;
        if (giaTri.soHieuVanBang && !d.soHieuVanBang.includes(giaTri.soHieuVanBang)) khopDuLieu = false;
        if (giaTri.soVaoSo && !d.soVaoSo.includes(giaTri.soVaoSo)) khopDuLieu = false;
        if (giaTri.maSinhVien && !d.maSinhVien.includes(giaTri.maSinhVien)) khopDuLieu = false;
        if (giaTri.hoTen && !d.hoTen.toLowerCase().includes(giaTri.hoTen.toLowerCase())) khopDuLieu = false;
        if (giaTri.ngaySinh && d.ngaySinh !== giaTri.ngaySinh.format('YYYY-MM-DD')) khopDuLieu = false;
        return khopDuLieu;
      });

      if (danhSachKetQua.length === 0) {
        message.warning('Không tìm thấy văn bằng nào phù hợp!');
      } else {
        message.success(`Tìm thấy ${danhSachKetQua.length} kết quả.`);
        const demLuot = { ...luotTraCuu };
        danhSachKetQua.forEach(item => {
          demLuot[item.idQuyetDinh] = (demLuot[item.idQuyetDinh] || 0) + 1;
        });
        setLuotTraCuu(demLuot);
        localStorage.setItem('th04_bangTraCuu', JSON.stringify(demLuot));
      }

      setKetQuaTimKiem(danhSachKetQua);
    });
  };

  const layThongTinQuyetDinh = (idQuyetDinh: string) => {
    const qd = danhSachQuyetDinh.find(d => d.id === idQuyetDinh);
    return qd ? `${qd.soQuyetDinh} (${qd.ngayBanHanh})` : 'Không xác định';
  };

  const cotDuLieu = [
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Mã SV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Hành động',
      key: 'hanhDong',
      render: (_: any, banGhi: any) => (
        <Button
          type="link"
          onClick={() => setXemChiTiet(banGhi)}
        >
          Chi Tiết
        </Button>
      ),
    },
  ];

  const hienThiLuotTraCuu = () => {
    const quyetDinhDuyNhat = Array.from(new Set(ketQuaTimKiem.map(r => r.idQuyetDinh)));
    if (quyetDinhDuyNhat.length === 0) return null;

    return quyetDinhDuyNhat.map(qdId => {
      const chuoiQd = layThongTinQuyetDinh(qdId);
      const soLuot = luotTraCuu[qdId] || 0;
      return <div key={qdId}><Text type="secondary">Lượt tra cứu của QĐ {chuoiQd}: </Text><strong>{soLuot}</strong> lần.</div>;
    });
  };

  return (
    <div>
      <Card title="Tìm kiếm văn bằng (Nhập ít nhất 2 điều kiện)" bordered={false} style={{ marginBottom: 24, background: '#f0f5ff' }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Số hiệu văn bằng" name="soHieuVanBang">
                <Input placeholder="VD: AA120394" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Số vào sổ" name="soVaoSo">
                <Input placeholder="VD: S2024-0001" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mã sinh viên" name="maSinhVien">
                <Input placeholder="VD: B20DCCN001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Họ tên" name="hoTen">
                <Input placeholder="VD: Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="ngaySinh">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" size="large" icon={<SearchOutlined />} onClick={xuLyTraCuu}>
              Tra cứu nhanh
            </Button>
            <Button size="large" style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
              Làm mới
            </Button>
          </div>
        </Form>
      </Card>

      {ketQuaTimKiem.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {hienThiLuotTraCuu()}
        </div>
      )}

      <Table dataSource={ketQuaTimKiem} columns={cotDuLieu} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal
        title="Chi Tiết Văn Bằng & Quyết Định"
        visible={xemChiTiet !== null}
        onCancel={() => setXemChiTiet(null)}
        footer={[<Button key="close" type="primary" onClick={() => setXemChiTiet(null)}>Đóng</Button>]}
        width={700}
      >
        {xemChiTiet && (
          <div>
            <Descriptions title="1. Thông Tin Văn Bằng" bordered column={2} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Số hiệu văn bằng">{xemChiTiet.soHieuVanBang}</Descriptions.Item>
              <Descriptions.Item label="Số vào sổ">{xemChiTiet.soVaoSo}</Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">{xemChiTiet.maSinhVien}</Descriptions.Item>
              <Descriptions.Item label="Họ tên sinh viên"><strong>{xemChiTiet.hoTen}</strong></Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{xemChiTiet.ngaySinh}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="2. Thông Tin Khác (Từ biểu mẫu)" bordered column={2} size="small" style={{ marginBottom: 20 }}>
              {Object.keys(xemChiTiet.duLieuDong || {}).map(idTruong => (
                <Descriptions.Item key={idTruong} label={`Mã Data #${idTruong}`}>{String(xemChiTiet.duLieuDong[idTruong])}</Descriptions.Item>
              ))}
              {Object.keys(xemChiTiet.duLieuDong || {}).length === 0 && <Descriptions.Item label="Không có">Không có dữ liệu thêm</Descriptions.Item>}
            </Descriptions>

            {(() => {
              const qd = danhSachQuyetDinh.find(d => d.id === xemChiTiet.idQuyetDinh);
              if (!qd) return null;
              return (
                <Descriptions title="3. Quyết Định Tốt Nghiệp" bordered column={1} size="small">
                  <Descriptions.Item label="Số Quyết Định"><strong>{qd.soQuyetDinh}</strong></Descriptions.Item>
                  <Descriptions.Item label="Ngày ban hành">{qd.ngayBanHanh}</Descriptions.Item>
                  <Descriptions.Item label="Trích yếu">{qd.trichYeu}</Descriptions.Item>
                </Descriptions>
              )
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TraCuuVanBang;
