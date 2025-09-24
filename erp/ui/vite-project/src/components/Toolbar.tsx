import { useMemo, type ChangeEvent } from "react";

type Props = {
  keyword: string;
  onKeyword: (v: string) => void;

  status: string;
  onStatus: (v: string) => void;

  onRefresh?: () => void;
  onBulkDelete?: () => void;

  onImport?: () => void;
  onExportHref?: string; // a[href]로 직접 다운로드
  onCreate?: () => void;
};

export default function Toolbar({
  keyword, onKeyword,
  status, onStatus,
  onRefresh, onBulkDelete,
  onImport, onExportHref,
  onCreate
}: Props){
  const rightDisabled = false;

  return (
    <div className="toolbar-row" style={{display:"flex", alignItems:"center", gap:8}}>
      {/* 좌측 영역 */}
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <input
          placeholder="검색: 사번/성명/부서/연락처/주소"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onKeyword(e.target.value)}
          className="tb-input"
        />
        <select value={status} onChange={(e)=>onStatus(e.target.value)} className="tb-select">
          <option value="">상태: 전체</option>
          <option value="재직">재직</option>
          <option value="퇴직">퇴직</option>
          <option value="퇴사예정">퇴사예정</option>
        </select>
        <button onClick={onRefresh} className="tb-btn">새로고침</button>
        <button onClick={onBulkDelete} className="tb-btn danger">선택삭제</button>
        <a href={onExportHref || "#"} className="tb-btn" download>CSV 내보내기</a>
        <button onClick={onImport} className="tb-btn">불러오기(CSV/XLSX)</button>
      </div>

      {/* 우측 영역 */}
      <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
        <button className="tb-btn hollow">목록</button>
        <button className="tb-btn hollow">카드</button>
        <button onClick={onCreate} className="tb-btn create">신규등록</button>
      </div>
    </div>
  );
}
