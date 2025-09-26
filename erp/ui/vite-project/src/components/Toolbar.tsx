import type { ChangeEvent } from "react";

type Props = {
  keyword: string;
  onKeyword: (v: string)=>void;
  status: "" | "재직" | "퇴사예정" | "퇴사";
  onStatus: (v: string)=>void;
  onBulkDelete: ()=>void;
  exportHref: string;               // "/engineers/export-csv"
  onImport: (file: File)=>void;     // 파일 1개 전달
  view: "list" | "card";
  onView: (v: "list"|"card")=>void;
  onCreate: ()=>void;
  selectedCount: number;
};

export default function Toolbar(p: Props){
  const openFile = ()=>{
    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".csv,text/csv";
    el.onchange = (e: Event)=>{
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) p.onImport(f);
    };
    el.click();
  };

  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"8px 12px",
      border:"1px solid var(--border)", borderRadius:8,
      background:"var(--panel-bg, transparent)"
    }}>
      {/* 좌측 */}
      <input
        placeholder="검색"
        value={p.keyword}
        onChange={(e: ChangeEvent<HTMLInputElement>)=>p.onKeyword(e.target.value)}
        style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)", color:"var(--fg)"}}
      />
      <select
        value={p.status}
        onChange={(e)=>p.onStatus(e.target.value)}
        style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)", color:"var(--fg)"}}
      >
        <option value="">상태</option>
        <option value="재직">재직</option>
        <option value="퇴사예정">퇴사예정</option>
        <option value="퇴사">퇴사</option>
      </select>

      <button onClick={p.onBulkDelete}
        style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background:"transparent", color:"var(--fg)"}}>
        선택삭제{p.selectedCount ? `(${p.selectedCount})` : ""}
      </button>

      {/* CSV 내보내기: a 태그로 직접 다운로드 */}
      <a href={p.exportHref} download
         style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, textDecoration:"none", background:"transparent", color:"var(--fg)"}}>
        CSV 내보내기
      </a>

      <button onClick={openFile}
        style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background:"transparent", color:"var(--fg)"}}>
        불러오기
      </button>

      {/* 우측 */}
      <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
        <button onClick={()=>p.onView("list")}
          style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background: p.view==="list"?"var(--chip-bg)": "transparent", color:"var(--fg)"}}>
          목록
        </button>
        <button onClick={()=>p.onView("card")}
          style={{padding:"6px 10px", border:"1px solid var(--border)", borderRadius:8, background: p.view==="card"?"var(--chip-bg)": "transparent", color:"var(--fg)"}}>
          카드
        </button>
        <button onClick={p.onCreate}
          style={{padding:"6px 12px", border:"1px solid var(--border)", borderRadius:8, background:"var(--create-bg,#eceff3)", color:"var(--create-fg,#222)"}}>
          신규등록
        </button>
      </div>
    </div>
  );
}
