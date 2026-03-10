import { useState, useEffect } from "react";
import { Layout, Menu, Table, Button, Form, Input, Select, InputNumber } from "antd";

const { Content, Sider } = Layout;

const mucDoList = ["Dễ", "Trung bình", "Khó", "Rất khó"];

const layDuLieu = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const luuDuLieu = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

function App() {
  const [menu, setMenu] = useState("1");

  const [khoi, setKhoi] = useState<any[]>([]);
  const [monHoc, setMonHoc] = useState<any[]>([]);
  const [cauHoi, setCauHoi] = useState<any[]>([]);
  const [deThi, setDeThi] = useState<any[]>([]);

  useEffect(() => {
    capNhat();
  }, []);

  const capNhat = () => {
    setKhoi(layDuLieu("khoi"));
    setMonHoc(layDuLieu("monHoc"));
    setCauHoi(layDuLieu("cauHoi"));
    setDeThi(layDuLieu("deThi"));
  };

  const themKhoi = (v: any) => {
    const ds = layDuLieu("khoi");
    ds.push({ id: Date.now(), ten: v.ten });
    luuDuLieu("khoi", ds);
    capNhat();
  };

  const themMon = (v: any) => {
    const ds = layDuLieu("monHoc");
    ds.push(v);
    luuDuLieu("monHoc", ds);
    capNhat();
  };

  const themCauHoi = (v: any) => {
    const ds = layDuLieu("cauHoi");
    ds.push(v);
    luuDuLieu("cauHoi", ds);
    capNhat();
  };

  const taoDe = (v: any) => {
    const ds = layDuLieu("cauHoi");

    const de = ds.filter((c: any) => c.maMon === v.maMon && c.mucDo === "Dễ").slice(0, v.de);
    const tb = ds.filter((c: any) => c.maMon === v.maMon && c.mucDo === "Trung bình").slice(0, v.tb);
    const kho = ds.filter((c: any) => c.maMon === v.maMon && c.mucDo === "Khó").slice(0, v.kho);
    const rk = ds.filter((c: any) => c.maMon === v.maMon && c.mucDo === "Rất khó").slice(0, v.rk);

    const deThiMoi = {
      id: Date.now(),
      maMon: v.maMon,
      danhSachCauHoi: [...de, ...tb, ...kho, ...rk],
    };

    const dsDe = layDuLieu("deThi");
    dsDe.push(deThiMoi);
    luuDuLieu("deThi", dsDe);
    capNhat();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ background: "#fff" }}>
        <Menu
          onClick={(e) => setMenu(e.key)}
          items={[
            { key: "1", label: "Khối kiến thức" },
            { key: "2", label: "Môn học" },
            { key: "3", label: "Câu hỏi" },
            { key: "4", label: "Tạo đề thi" },
          ]}
        />
      </Sider>

      <Layout>
        <h2>Quản lý ngân hàng câu hỏi</h2>

        <Content style={{ padding: 20 }}>

          {menu === "1" && (
            <>
              <Form layout="inline" onFinish={themKhoi}>
                <Form.Item name="ten">
                  <Input placeholder="Tên khối" />
                </Form.Item>
                <Button htmlType="submit">Thêm</Button>
              </Form>

              <Table
                style={{ marginTop: 20 }}
                dataSource={khoi}
                columns={[
                  { title: "ID", dataIndex: "id" },
                  { title: "Tên khối", dataIndex: "ten" },
                ]}
                rowKey="id"
              />
            </>
          )}

          {menu === "2" && (
            <>
              <Form layout="inline" onFinish={themMon}>
                <Form.Item name="maMon">
                  <Input placeholder="Mã môn" />
                </Form.Item>

                <Form.Item name="tenMon">
                  <Input placeholder="Tên môn" />
                </Form.Item>

                <Form.Item name="soTinChi">
                  <InputNumber placeholder="Tín chỉ" />
                </Form.Item>

                <Button htmlType="submit">Thêm</Button>
              </Form>

              <Table
                style={{ marginTop: 20 }}
                dataSource={monHoc}
                columns={[
                  { title: "Mã môn", dataIndex: "maMon" },
                  { title: "Tên môn", dataIndex: "tenMon" },
                  { title: "Tín chỉ", dataIndex: "soTinChi" },
                ]}
                rowKey="maMon"
              />
            </>
          )}

          {menu === "3" && (
            <>
              <Form layout="vertical" onFinish={themCauHoi}>
                <Form.Item name="maCauHoi" label="Mã câu hỏi">
                  <Input />
                </Form.Item>

                <Form.Item name="maMon" label="Môn">
                  <Select options={monHoc.map((m) => ({ value: m.maMon, label: m.tenMon }))} />
                </Form.Item>

                <Form.Item name="noiDung" label="Nội dung">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item name="mucDo" label="Mức độ">
                  <Select options={mucDoList.map((m) => ({ value: m, label: m }))} />
                </Form.Item>

                <Form.Item name="khoiKienThuc" label="Khối">
                  <Select options={khoi.map((k) => ({ value: k.ten, label: k.ten }))} />
                </Form.Item>

                <Button htmlType="submit">Thêm câu hỏi</Button>
              </Form>

              <Table
                style={{ marginTop: 20 }}
                dataSource={cauHoi}
                columns={[
                  { title: "Mã", dataIndex: "maCauHoi" },
                  { title: "Môn", dataIndex: "maMon" },
                  { title: "Nội dung", dataIndex: "noiDung" },
                  { title: "Mức độ", dataIndex: "mucDo" },
                  { title: "Khối", dataIndex: "khoiKienThuc" },
                ]}
                rowKey="maCauHoi"
              />
            </>
          )}

          {menu === "4" && (
            <>
              <Form layout="vertical" onFinish={taoDe}>
                <Form.Item name="maMon" label="Môn">
                  <Select options={monHoc.map((m) => ({ value: m.maMon, label: m.tenMon }))} />
                </Form.Item>

                <Form.Item name="de" label="Số câu dễ">
                  <InputNumber />
                </Form.Item>

                <Form.Item name="tb" label="Số câu trung bình">
                  <InputNumber />
                </Form.Item>

                <Form.Item name="kho" label="Số câu khó">
                  <InputNumber />
                </Form.Item>

                <Form.Item name="rk" label="Số câu rất khó">
                  <InputNumber />
                </Form.Item>

                <Button htmlType="submit">Tạo đề</Button>
              </Form>

              <Table
                style={{ marginTop: 20 }}
                dataSource={deThi}
                columns={[
                  { title: "ID", dataIndex: "id" },
                  { title: "Môn", dataIndex: "maMon" },
                  { title: "Số câu", render: (r: any) => r.danhSachCauHoi.length },
                ]}
                rowKey="id"
              />
            </>
          )}

        </Content>
      </Layout>
    </Layout>
  );
}

export default App;