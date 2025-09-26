import type { ChangeEvent } from "react";

type Props = {
  keyword: string;
  onKeyword: React.Dispatch<React.SetStateAction<string>>;
  status: "" | "재직" | "퇴사예정" | "퇴사";
  onStatus: (v: string) => void;
  onBulkDelete: () => Promise<void>;
  exportHref: string;
  onImport: (file: File) => void;
  view: "list" | "card";
  onView: (v: "list" | "card") => void;
  onCreate: () => void;
  selectedCount: number;
};

export default function Toolbar({
  keyword, onKeyword,
  status, onStatus,
  onBulkDelete, exportHref, onImport,
  view, onView, onCreate, selectedCount
}: Props){
  return (
    <div className="toolbar">
      <div className="left">
        <input
          className="tb-input"
          placeholder="검색 (사번/성명)"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>)=>onKeyword(e.target.value)}
        />
        <select
          className="tb-select"
          value={status}
          onChange={(e)=>onStatus(e.target.value)}
        >
          <option value="">상태</option>
          <option value="재직">재직</option>
          <option value="퇴사예정">퇴사예정</option>
          <option value="퇴사">퇴사</option>
        </select>

        <button className="tb-btn" onClick={onBulkDelete} disabled={selectedCount===0}>
          선택삭제{selectedCount>0?` (${selectedCount})`:""}
        </button>

        <a className="tb-btn" href={exportHref} download>CSV 내보내기</a>

        <label className="tb-btn">
          불러오기
          <input type="file" accept=".csv,text/csv"
                 style={{display:"none"}}
                 onChange={(e)=>{ const f=e.target.files?.[0]; if(f) onImport(f); e.currentTarget.value=""; }}/>
        </label>
      </div>

      <div className="right">
        <button className={`tb-seg ${view==="list"?"on":""}`} onClick={()=>onView("list")}>목록</button>
        <button className={`tb-seg ${view==="card"?"on":""}`} onClick={()=>onView("card")}>카드</button>
        <button className="tb-btn create" onClick={onCreate}>신규등록</button>
      </div>
    </div>
  );
}
