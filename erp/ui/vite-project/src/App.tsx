import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainHeader from "./components/MainHeader";
import Engineers from "./pages/Engineers";

function Placeholder({title}:{title:string}) {
  return (
    <div style={{padding:16}}>
      <h1 style={{margin:"12px 0"}}>{title}</h1>
      <div className="muted">준비 중</div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <MainHeader />
      <div style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Placeholder title="준비 중" />} />
          <Route path="/engineers" element={<Engineers/>} />
          <Route path="/projects" element={<Placeholder title="프로젝트" />} />
          <Route path="/licenses" element={<Placeholder title="면허" />} />
          <Route path="/pq" element={<Placeholder title="PQ" />} />
          <Route path="/bids" element={<Placeholder title="입찰" />} />
          <Route path="/docs" element={<Placeholder title="문서" />} />
          <Route path="/estimates" element={<Placeholder title="견적" />} />
          <Route path="/weekly" element={<Placeholder title="주간회의" />} />
          <Route path="/analytics" element={<Placeholder title="분석" />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}