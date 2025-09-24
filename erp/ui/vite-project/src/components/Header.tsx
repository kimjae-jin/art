import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../theme.css";

export default function Header(){
  const [theme,setTheme]=useState<"light"|"dark">(
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"
  );
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme==="dark"?"dark":""); },[theme]);
  const loc = useLocation();
  const Nav = ({to,label}:{to:string;label:string}) => (
    <Link to={to} className={`nav ${loc.pathname.startsWith(to) ? "nav-active":""}`}>{label}</Link>
  );
  return (
    <div className="header" role="banner" aria-label="ERP 헤더">
      <div className="brand"><Link to="/" className="brand-link">ERP</Link></div>
      <div className="navs">
        <Nav to="/" label="홈"/>
        <Nav to="/engineers" label="기술인"/>
        <Nav to="/projects" label="프로젝트"/>
        <Nav to="/licenses" label="면허"/>
      </div>
      <div className="spacer" />
      <div className="chip" aria-label="현재 시각">{new Date().toLocaleString()}</div>
      <button className="btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} aria-label="모드 전환">
        {theme==="dark"?"라이트":"다크"}
      </button>
    </div>
  );
}
