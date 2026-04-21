import { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { KhoaHoc, danhSachGiangVien } from '../index';

const { Option } = Select;

interface ThuocTinhModalKhoaHoc {
    hienThi: boolean;
    khiHuy: () => void;
    khiDongY: (giaTri: Omit<KhoaHoc, 'id'>) => boolean;
    giaTriBanDau: KhoaHoc | null;
}

const ModalKhoaHoc = ({ hienThi, khiHuy, khiDongY, giaTriBanDau }: ThuocTinhModalKhoaHoc) => {
    const [bieuMau] = Form.useForm();

    useEffect(() => {
        if (hienThi) {
            if (giaTriBanDau) {
                bieuMau.setFieldsValue(giaTriBanDau);
            } else {
                bieuMau.resetFields();
                bieuMau.setFieldsValue({
                    soHocVien: 0,
                    trangThai: 'Đang mở'
                });
            }
        }
    }, [hienThi, giaTriBanDau, bieuMau]);

    const xuLyDongY = () => {
        bieuMau.validateFields()
            .then((giaTri) => {
                const thanhCong = khiDongY(giaTri as Omit<KhoaHoc, 'id'>);
                if (thanhCong) {
                    bieuMau.resetFields();
                }
            })
            .catch((thongTin) => {
                console.log('Xác thực thất bại:', thongTin);
            });
    };

    return (
        <Modal
            title={giaTriBanDau ? 'Chỉnh Sửa Khóa Học' : 'Thêm Mới Khóa Học'}
            visible={hienThi}
            onOk={xuLyDongY}
            onCancel={khiHuy}
            okText="Lưu thông tin"
            cancelText="Hủy bỏ"
            width={700}
            destroyOnClose
        >
            <Form
                form={bieuMau}
                layout="vertical"
                name="bieuMauKhoaHoc"
            >
                <Form.Item
                    name="tenKhoaHoc"
                    label="Tên khóa học"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên khóa học!' },
                        { max: 100, message: 'Tên khóa học tối đa 100 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên khóa học (Tối đa 100 ký tự)..." maxLength={100} />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        name="giangVien"
                        label="Giảng viên"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
                    >
                        <Select placeholder="Chọn giảng viên">
                            {danhSachGiangVien.map(gv => (
                                <Option key={gv} value={gv}>{gv}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="soHocVien"
                        label="Số lượng học viên"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Số lượng..." />
                    </Form.Item>
                </div>

                <Form.Item
                    name="trangThai"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái khóa học!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="Đang mở">Đang mở</Option>
                        <Option value="Đã kết thúc">Đã kết thúc</Option>
                        <Option value="Tạm dừng">Tạm dừng</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="moTa"
                    label="Mô tả khóa học"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
                >
                    <Input.TextArea
                        rows={6}
                        placeholder="Mô tả"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalKhoaHoc;
