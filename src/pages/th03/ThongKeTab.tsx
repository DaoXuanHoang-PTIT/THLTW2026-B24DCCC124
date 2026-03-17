import { useEffect, useState } from "react";

export default function ThongKeTab() {
  const [lichHen, setLichHen] = useState<any[]>([]);
  const [dichVu, setDichVu] = useState<any[]>([]);

  useEffect(() => {
    const lh = localStorage.getItem("lichhen");
    const dv = localStorage.getItem("dichvu");

    if (lh) setLichHen(JSON.parse(lh));
    if (dv) setDichVu(JSON.parse(dv));
  }, []);

  const doanhThu = lichHen
    .filter((i) => i.trangThai === "Hoan thanh")
    .reduce((t, i) => {
      const dv = dichVu.find((d) => d.id === i.idDichVu);
      return t + (dv?.gia || 0);
    }, 0);

  return (
    <div>
      <h3>Tổng lịch hẹn: {lichHen.length}</h3>
      <h3>Doanh thu: {doanhThu}</h3>
    </div>
  );
}