import { useState } from "react";
import { Button, InputNumber, message } from "antd";

const doanSo = () => {
  const [soNgauNhien] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  console.log(soNgauNhien);
  const [soDuDoan, setsoDuDoan] = useState<number | null>(null);
  const [soLuot, setsoLuot] = useState<number>(10);

  const nhapSo = () => {
    if (soDuDoan === null) {
      message.warning("Vui lòng nhập số!");
      return;
    }

    if (soLuot <= 0) return;

    if (soDuDoan === soNgauNhien) {
      message.success("Chúc mừng! Bạn đã đoán đúng!");
    } else if (soDuDoan < soNgauNhien) {
      message.info("Bạn đoán quá thấp!");
    } else {
      message.info("Bạn đoán quá cao!");
    }

    const luotMoi = soLuot - 1;
    setsoLuot(luotMoi);

    if (luotMoi === 0 && soDuDoan !== soNgauNhien) {
      message.error(`Bạn đã hết lượt! Số đúng là ${soNgauNhien}`);
    }
  };

  return (
    <div>
      <h2>Game of the year</h2>

      <p>Lượt còn lại: {soLuot} </p>

      <InputNumber
        min={1}
        max={100}
        value={soDuDoan ?? undefined}
        onChange={(value) => setsoDuDoan(value)}
      />

      <Button type="primary" onClick={nhapSo} style={{ marginLeft: 10 }}>
        Đoán
      </Button>
      
    </div>
  );
};

export default doanSo;