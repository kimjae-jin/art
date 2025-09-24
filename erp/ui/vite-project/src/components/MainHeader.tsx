import { Link, useLocation } from "react-router-dom";
import React from "react";

const MENUS = [
  { to: "/", label: "ERP" }, // 홈 역할
  { to: "/engineers", label: "기술인" },
  { to: "/projects", label: "프로젝트" },
  { to: "/licenses", label: "면허" },
  { to: "/pq", label: "PQ" },
  { to: "/bids", label: "입찰" },
  { to: "/docs", label: "문서" },
  { to: "/estimates", label: "견적" },
  { to: "/weekly", label: "주간회의" },
  { to: "/analytics", label: "분석" },
];

export default function MainHeader() {
  const loc = useLocation();
  const [now, setNow] = React.useState<string>(() => new Date().toLocaleString());
  const [theme, setTheme] = React.useState<string>(() => localStorage.getItem("theme") || "dark");

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme as any;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header style={{
      position:"sticky", top:0, zIndex:1000,
      backdropFilter:"saturate(180%) blur(8px)",
      background:"var(--header-bg, rgba(17,24,39,.8))",
      borderBottom:"1px solid var(--border, #2f3640)"
    }}>
      <nav style={{display:"flex", alignItems:"center", gap:12, padding:"10px 16px", overflowX:"auto"}}>
        {MENUS.map(m=>{
          const active = loc.pathname === m.to || (m.to !== "/" && loc.pathname.startsWith(m.to));
          return (
            <Link key={m.to} to={m.to}
              style={{
                textDecoration:"none", whiteSpace:"nowrap",
                padding:"6px 10px", borderRadius:8,
                fontWeight: m.to === "/" ? 700 : 500,
                color: active ? "var(--active-fg,#fff)" : "var(--fg,#e5e7eb)",
                background: active ? "var(--active-bg,#334155)" : "transparent",
                border: active ? "1px solid var(--border,#475569)" : "1px solid transparent"
              }}>
              {m.label}
            </Link>
          );
        })}
        <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
          <span className="muted" style={{fontSize:12, opacity:.8}}>{now}</span>
          <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
            style={{padding:"4px 8px", borderRadius:6, border:"1px solid var(--border,#475569)", background:"transparent", color:"var(--fg,#e5e7eb)"}}>
            {theme==="dark" ? "라이트" : "다크"}
          </button>
        </div>
      </nav>
    </header>
  );
}