// frontend/client/src/App.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import EngineersPage from "./pages/EngineersPage";

/** 시계 훅: format을 useCallback으로 고정하고 deps에 포함 */
function useClock() {
  const day = useMemo(() => ["일", "월", "화", "수", "목", "금", "토"], []);
  const pad = (n: number) => String(n).padStart(2, "0");

  const format = useCallback(
    (d: Date) => {
      const yy = pad(d.getFullYear() % 100);
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const dow = day[d.getDay()];
      const h = d.getHours();
      const m = pad(d.getMinutes());
      const s = pad(d.getSeconds());
      return `${yy}.${mm}.${dd}.(${dow}) ${h}:${m}:${s}`;
    },
    [day], // day가 바뀌면 format도 갱신
  );

  const [now, setNow] = useState(() => format(new Date()));
  useEffect(() => {
    const t = window.setInterval(() => setNow(format(new Date())), 1000);
    return () => window.clearInterval(t);
  }, [format]); // 경고 해소

  return now;
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

function Header() {
  const { theme, setTheme } = useTheme();
  const now = useClock();
  const navigate = useNavigate();
  return (
    <header className="app-header main-header">
      <button className="logo" onClick={() => navigate("/")}>ERP</button>
      <div className="spacer" />
      <span className="clock" aria-label="현재 시각">{now}</span>
      <button
        aria-label="모드 전환"
        className="mode-btn"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={theme === "dark" ? "라이트 모드" : "다크 모드"}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}

function Home() {
  const cards = [
    { to: "/engineers", label: "기술인" },
    { to: "/projects", label: "프로젝트" },
    { to: "/clients", label: "거래처" },
    { to: "/licenses", label: "면허" },
    { to: "/equipment", label: "장비" },
    { to: "/photos", label: "사진대지" },
    { to: "/invoices", label: "청구/세금계산서" },
    { to: "/quotations", label: "견적" },
    { to: "/training", label: "교육/자격" },
    { to: "/awards", label: "상훈" },
    { to: "/alerts", label: "알림 대시보드" },
  ];
  return (
    <main className="container">
      <h1 className="title">카테고리를 선택하세요</h1>
      <div className="grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card" draggable={false}>
            {c.label}
          </Link>
        ))}
      </div>
    </main>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <main className="container">
      <h1 className="title">{name}</h1>
      <p className="sub">이 페이지는 나중에 실제 기능 화면으로 교체됩니다.</p>
    </main>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/engineers" element={<EngineersPage />} />
        <Route path="/projects" element={<Placeholder name="프로젝트" />} />
        <Route path="/clients" element={<Placeholder name="거래처" />} />
        <Route path="/licenses" element={<Placeholder name="면허" />} />
        <Route path="/equipment" element={<Placeholder name="장비" />} />
        <Route path="/photos" element={<Placeholder name="사진대지" />} />
        <Route path="/invoices" element={<Placeholder name="청구/세금계산서" />} />
        <Route path="/quotations" element={<Placeholder name="견적" />} />
        <Route path="/training" element={<Placeholder name="교육/자격" />} />
        <Route path="/awards" element={<Placeholder name="상훈" />} />
        <Route path="/alerts" element={<Placeholder name="알림 대시보드" />} />
      </Routes>
    </div>
  );
}