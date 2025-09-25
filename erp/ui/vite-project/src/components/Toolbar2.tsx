import type { ChangeEvent } from "react";
type View = "list"|"card";
type Props = {
  keyword?: string;
  onKeyword?: (v:string)=>void;
  status?: ""|"재직"|"퇴사예정"|"퇴사";
  onStatus?: (v:string)=>void;
  onBulkDelete?: ()=>void;
  exportHref?: string;
  onImport?: (file:File)=>void;
  view?: View;
  onChangeView?: (v:View)=>void;
  onCreate?: ()=>void;
  selectedCount?: number;
};
export default function Toolbar2(p:Props){
  const {
    keyword="", onKeyword=()=>{},
    status="", onStatus=()=>{},
    onBulkDelete=()=>{},
    exportHref="/engineers/export-csv",
    onImport=()=>{},
    view="list", onChangeView=()=>{},
    onCreate=()=>{},
    selectedCount=0,
  } = p;
  return (
    <div className="tb">
      <div className="left">
        <input className="tb-input" placeholder="검색"
               value={keyword} onChange={(e:ChangeEvent<HTMLInputElement>)=>onKeyword(e.target.value)} />
        <select className="tb-select" value={status} onChange={e=>onStatus(e.target.value as any)}>
          <option value="">상태</option>
          <option value="재직">재직</option>
          <option value="퇴사예정">퇴사예정</option>
          <option value="퇴사">퇴사</option>
        </select>
        <button className="tb-btn" onClick={onBulkDelete} disabled={selectedCount===0}>
          선택삭제{selectedCount?` (${selectedCount})`:``}
        </button>
        <a className="tb-btn" href={exportHref} download>CSV 내보내기</a>
        <label className="tb-btn" style={{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          불러오기
          <input type="file" accept=".csv" style={{display:"none"}}
                 onChange={e=>{ const f=e.target.files?.[0]; if(f) onImport(f); e.currentTarget.value=""; }} />
        </label>
      </div>
      <div className="right">
        <button className="tb-btn ghost" aria-pressed={view==="list"} onClick={()=>onChangeView("list")}>목록</button>
        <button className="tb-btn ghost" aria-pressed={view==="card"} onClick={()=>onChangeView("card")}>카드</button>
        <button className="tb-btn create" onClick={onCreate}>신규등록</button>
      </div>
    </div>
  );
}
