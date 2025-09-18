import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Header } from "./components/Header";
import EngineersPage from "./pages/EngineersPage";

// 홈 그리드 버튼(기존 스타일 유지)
const Home: React.FC = () => {
  const items = [
    { to: "/engineers", label: "기술인" },
    { to: "#", label: "프로젝트" },
    { to: "#", label: "거래처" },
    { to: "#", label: "면허" },
    { to: "#", label: "사무집기" },
    { to: "#", label: "장비(검교정)" },
    { to: "#", label: "교육/상훈" },
    { to: "#", label: "실적" },
    { to: "#", label: "발표/대외활동" },
  ];
  return (
    <div className="container">
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ margin: "0 0 12px 0" }}>카테고리 선택</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {items.map((x) => (
            <Link key={x.label} className="btn" to={x.to} style={{ minWidth: 96, textAlign: "center" }}>
              {x.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      {/* 기존 상단과 운영페이지 상단 사이 1mm 여백은 index.css의 .app-header + .container 로 확보 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/engineers" element={<EngineersPage />} />
        {/* 다른 페이지는 파일 생성 후 아래처럼 라우트 추가하세요.
            <Route path="/projects" element={<ProjectsPage />} />
        */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;