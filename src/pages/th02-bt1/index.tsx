import { useState, useEffect } from "react";
import { Button, message } from "antd";

interface LichSu {
  player: string;
  computer: string;
  result: string;
  time: string;
}

const luaChon = ["Kéo", "Búa", "Bao"];

const OanTuXi = () => {
  const [playerChon, setPlayerChon] = useState<string>("");
  const [computerChon, setComputerChon] = useState<string>("");
  const [ketQua, setKetQua] = useState<string>("");
  const [history, setHistory] = useState<LichSu[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("historyOanTuXi");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("historyOanTuXi", JSON.stringify(history));
  }, [history]);

  const choiGame = (chon: string) => {
    const computer = luaChon[Math.floor(Math.random() * 3)];

    let res = "";

    if (chon === computer) res = "Hòa";
    else if (
      (chon === "Kéo" && computer === "Bao") ||
      (chon === "Búa" && computer === "Kéo") ||
      (chon === "Bao" && computer === "Búa")
    ) {
      res = "Bạn thắng";
    //   message.success("Bạn thắng!");
    } else {
      res = "Bạn thua";
    //   message.error("Bạn thua!");
    }

    setPlayerChon(chon);
    setComputerChon(computer);
    setKetQua(res);

    const newGame: LichSu = {
      player: chon,
      computer: computer,
      result: res,
      time: new Date().toLocaleTimeString(),
    };

    setHistory([newGame, ...history]);
  };

  const xoaLichSu = () => {
    setHistory([]);
    localStorage.removeItem("historyOanTuXi");
    message.success("Đã xóa lịch sử!");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Game Of The Year</h2>

      <div style={{ marginBottom: 20 }}>
        {luaChon.map((c) => (
          <Button
            key={c}
            type="primary"
            onClick={() => choiGame(c)}
            style={{ margin: 10 }}
          >
            {c}
          </Button>
        ))}
      </div>

      <h3>Bạn chọn: {playerChon}</h3>
      <h3>Máy chọn: {computerChon}</h3>
      <h2>Kết quả: {ketQua}</h2>

      <hr />

      <h3>Lịch sử chơi</h3>

      <Button danger onClick={xoaLichSu}>
        Xóa lịch sử
      </Button>

      <table border={3} style={{ margin: "20px auto" }}>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Bạn</th>
            <th>Máy</th>
            <th>Kết quả</th>
          </tr>
        </thead>

        <tbody>
          {history.map((h, index) => (
            <tr key={index}>
              <td>{h.time}</td>
              <td>{h.player}</td>
              <td>{h.computer}</td>
              <td>{h.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OanTuXi;