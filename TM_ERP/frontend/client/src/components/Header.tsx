import React, { useEffect, useState } from "react";
import { useTheme } from "../theme";

const DAYS = ["일","월","화","수","목","금","토"];
const fmt = (d: Date) =>
  `${String(d.getFullYear()).slice(-2)}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}.(${DAYS[d.getDay()]}) ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;

export const Header: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [now, setNow] = useState(fmt(new Date()));
  useEffect(() => { const id = setInterval(()=>setNow(fmt(new Date())), 1000); return () => clearInterval(id); }, []);
  return (
    <header className="app-header">
      <div className="app-header__left" onClick={() => (window.location.href="/")} title="홈">
        <span className="logo">ERP</span>
      </div>
      <div className="app-header__right">
        <span className="clock">{now}</span>
        <button className="mode-toggle" onClick={toggle} aria-label="테마 전환">
          <span className="mode-label">{theme === "dark" ? "다크" : "라이트"}</span>
        </button>
      </div>
    </header>
  );
};
