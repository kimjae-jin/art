import React from "react";

type Props = {
  keyword: string;
  onKeyword: (v:string)=>void;
  status: string;
  onStatus: (v:string)=>void;
  onImport: ()=>void;
  onExportCSV: ()=>void;
  onExportXLSX: ()=>void;
  onNew: ()=>void;
  anyChecked: boolean;
  onDeleteSelected: ()=>void;
};

export default function ListToolbar(p:Props){
  return (
    <div style={{
      display:"flex", gap:8, alignItems:"center", flexWrap:"wrap",
      padding:"8px 0"
    }}>
      {/* 찾기상자 - 항상 좌측 */}
      <input
        value={p.keyword}
        onChange={e=>p.onKeyword(e.target.value)}
        placeholder="검색(사번/성명/프로젝트명 등)"
        className="input"
        style={{minWidth:260}}
      />
      {/* 상태별 보기 */}
      <select className="select" value={p.status} onChange={e=>p.onStatus(e.target.value)}>
        <option value="">전체 상태</option>
        <option value="재직">재직</option>
        <option value="퇴사예정">퇴사예정</option>
        <option value="퇴직">퇴직</option>
      </select>

      <div className="spacer" />

      {/* 선택삭제 */}
      <button className="btn danger" disabled={!p.anyChecked} onClick={p.onDeleteSelected}>선택삭제</button>

      {/* 불러오기/내보내기 */}
      <button className="btn" onClick={p.onImport}>불러오기(CSV/XLSX)</button>
      <button className="btn" onClick={p.onExportCSV}>CSV 내보내기</button>
      <button className="btn" onClick={p.onExportXLSX}>XLSX 내보내기</button>

      {/* 신규등록 */}
      <button className="btn primary" onClick={p.onNew}>신규 등록</button>
    </div>
  );
}
