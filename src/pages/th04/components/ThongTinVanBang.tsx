import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Tag, InputNumber, Descriptions } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

interface VanBang {
  id: string;
  idQuyetDinh: string;
  idSoVanBang: string;
  soVaoSo: string;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  duLieuDong: Record<string, any>;
}

const ThongTinVanBang: React.FC = () => {
  const [danhSachVanBang, setDanhSachVanBang] = useState<VanBang[]>([]);
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<any[]>([]);
  const [danhSachSo, setDanhSachSo] = useState<any[]>([]);
  const [truongDuLieu, setTruongDuLieu] = useState<any[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [xemChiTiet, setXemChiTiet] = useState<VanBang | null>(null);
  const [quyetDinhDuocChon, setQuyetDinhDuocChon] = useState<string | null>(null);
  const [form] = Form.useForm();

  const taiDuLieu = () => {
    const vanBangDaLuu = localStorage.getItem('th04_vanBang');
    if (vanBangDaLuu) setDanhSachVanBang(JSON.parse(vanBangDaLuu));

    const quyetDinhDaLuu = localStorage.getItem('th04_quyetDinh');
    if (quyetDinhDaLuu) setDanhSachQuyetDinh(JSON.parse(quyetDinhDaLuu));

    const soDaLuu = localStorage.getItem('th04_soVanBang');
    if (soDaLuu) setDanhSachSo(JSON.parse(soDaLuu));

    const truongDuLieuDaLuu = localStorage.getItem('th04_cauHinhBieuMau');
    if (truongDuLieuDaLuu) setTruongDuLieu(JSON.parse(truongDuLieuDaLuu));
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  const luuDanhSachVanBang = (danhSachMoi: VanBang[]) => {
    setDanhSachVanBang(danhSachMoi);
    localStorage.setItem('th04_vanBang', JSON.stringify(danhSachMoi));
  };

  const quyetDinhHienHinh = danhSachQuyetDinh.find(d => d.id === quyetDinhDuocChon);
  const soHienHanh = quyetDinhHienHinh ? danhSachSo.find(b => b.id === quyetDinhHienHinh.idSoVanBang) : null;

  const moModalThemMoi = () => {
    if (!quyetDinhDuocChon) {
      message.warning('Vui lòng chọn quyết định tốt nghiệp trước!');
      return;
    }
    if (!soHienHanh) {
      message.error('Không tìm thấy sổ văn bằng của quyết định này!');
      return;
    }
    form.resetFields();

    const chuoiSoVaoSo = `S${soHienHanh.namCap}-${String(soHienHanh.soHienTai).padStart(4, '0')}`;
    form.setFieldsValue({
      soVaoSo: chuoiSoVaoSo
    });
    setHienThiModal(true);
  };

  const xuLyLuu = () => {
    form.validateFields().then((giaTri) => {
      if (!soHienHanh) return;

      const duLieuDong: Record<string, any> = {};
      truongDuLieu.forEach(truong => {
        duLieuDong[truong.id] = giaTri[`truong_${truong.id}`];
        if (truong.kieuDuLieu === 'Date' && giaTri[`truong_${truong.id}`]) {
          duLieuDong[truong.id] = giaTri[`truong_${truong.id}`].format('YYYY-MM-DD');
        }
      });

      const vanBangMoi: VanBang = {
        id: Date.now().toString(),
        idQuyetDinh: quyetDinhDuocChon!,
        idSoVanBang: soHienHanh.id,
        soVaoSo: giaTri.soVaoSo,
        soHieuVanBang: giaTri.soHieuVanBang,
        maSinhVien: giaTri.maSinhVien,
        hoTen: giaTri.hoTen,
        ngaySinh: giaTri.ngaySinh ? giaTri.ngaySinh.format('YYYY-MM-DD') : '',
        duLieuDong
      };

      luuDanhSachVanBang([...danhSachVanBang, vanBangMoi]);

      const danhSachSoCapNhat = danhSachSo.map(b => {
        if (b.id === soHienHanh.id) {
          return { ...b, soHienTai: b.soHienTai + 1 };
        }
        return b;
      });
      setDanhSachSo(danhSachSoCapNhat);
      localStorage.setItem('th04_soVanBang', JSON.stringify(danhSachSoCapNhat));

      message.success('Cấp mới nội dung văn bằng thành công!');
      setHienThiModal(false);
    });
  };

  const hienThiTruongDong = (truong: any) => {
    let theInput;
    if (truong.kieuDuLieu === 'Number') {
      theInput = <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${truong.tenTruong.toLowerCase()}`} />;
    } else if (truong.kieuDuLieu === 'Date') {
      theInput = <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder={`Chọn ${truong.tenTruong.toLowerCase()}`} />;
    } else {
      theInput = <Input placeholder={`Nhập ${truong.tenTruong.toLowerCase()}`} />;
    }

    return (
      <Form.Item key={truong.id} label={truong.tenTruong} name={`truong_${truong.id}`} rules={[{ required: true, message: `Vui lòng nhập ${truong.tenTruong}!` }]}>
        {theInput}
      </Form.Item>
    );
  };

  const danhSachLoc = quyetDinhDuocChon ? danhSachVanBang.filter(d => d.idQuyetDinh === quyetDinhDuocChon) : danhSachVanBang;

  const cotDuLieu = [
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', render: (t: string) => <Tag color="volcano">{t}</Tag> },
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', render: (t: string) => <strong>{t}</strong> },
    { title: 'MSV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Hành động',
      key: 'hanhDong',
      render: (_: any, banGhi: VanBang) => (
        <Button onClick={() => setXemChiTiet(banGhi)}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span><strong>Chọn Quyết Định:</strong></span>
          <Select
            style={{ width: 300 }}
            placeholder="--- Chọn đợt quyết định tốt nghiệp ---"
            onChange={v => setQuyetDinhDuocChon(v)}
            options={danhSachQuyetDinh.map(d => ({ label: `${d.soQuyetDinh} (${d.ngayBanHanh})`, value: d.id }))}
          />
          <Button onClick={taiDuLieu}>Tải Lại</Button>
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={moModalThemMoi} disabled={!quyetDinhDuocChon}>
          Cấp Mới Văn Bằng
        </Button>
      </div>

      <Table dataSource={danhSachLoc} columns={cotDuLieu} rowKey="id" />

      <Modal
        title="Thêm Mới Thông Tin Văn Bằng"
        visible={hienThiModal}
        onOk={xuLyLuu}
        onCancel={() => setHienThiModal(false)}
        okText="Cấp Văn Bằng"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Số vào sổ (Tự động)" name="soVaoSo">
              <Input disabled style={{ fontWeight: 'bold', color: '#1890ff' }} />
            </Form.Item>
            <Form.Item label="Số hiệu văn bằng" name="soHieuVanBang" rules={[{ required: true, message: 'Vui lòng nhập số hiệu!' }]}>
              <Input placeholder="VD: AA120394" />
            </Form.Item>
            <Form.Item label="Mã sinh viên" name="maSinhVien" rules={[{ required: true, message: 'Vui lòng nhập MSV!' }]}>
              <Input placeholder="VD: B20DCCN001" />
            </Form.Item>
            <Form.Item label="Họ và tên" name="hoTen" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="ngaySinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" />
            </Form.Item>

            {truongDuLieu.map(hienThiTruongDong)}
          </div>
        </Form>
      </Modal>

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

export default ThongTinVanBang;
