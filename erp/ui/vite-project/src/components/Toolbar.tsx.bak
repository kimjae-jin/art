import type { ChangeEvent } from "react";
import "./../styles/toolbar.css";

type Props = {
  q: string;
  onChangeQ: (v: string) => void;
  status: string;
  onChangeStatus: (v: string) => void;
  onDeleteSelected?: () => void;
  exportHref?: string;                 // 예: "/engineers/export-csv"
  onImportClick?: () => void;          // 파일 선택 모달/다이얼로그 트리거
  onList?: () => void;
  onCard?: () => void;
  onCreate?: () => void;
  createLabel?: string;                // "신규 등록"
};

export default function Toolbar({
  q, onChangeQ, status, onChangeStatus,
  onDeleteSelected, exportHref, onImportClick,
  onList, onCard, onCreate, createLabel = "신규 등록",
}: Props) {
  return (
    <div className="toolbar">
      {/* 좌측: 찾기박스, 상태, 선택삭제, 내보내기, 불러오기 */}
      <div className="left">
        <input
          className="tb-input"
          placeholder="검색: 사번/성명/부서/연락처/주소"
          value={q}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeQ(e.target.value)}
        />
        <select
          className="tb-chip"
          value={status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChangeStatus(e.target.value)}
        >
          <option value="">상태</option>
          <option value="재직">재직</option>
          <option value="퇴직예정">퇴직예정</option>
          <option value="퇴직">퇴직</option>
        </select>

        <button className="tb-btn ghost" onClick={onDeleteSelected}>선택삭제</button>

        {/* 내보내기: 반드시 <a download> */}
        <a
          className="tb-btn"
          href={exportHref ?? "#"}
          download
          onClick={(e) => {
            if (!exportHref) e.preventDefault();
          }}
        >CSV 내보내기</a>

        <button className="tb-btn" onClick={onImportClick}>불러오기(CSV/XLSX)</button>
      </div>

      {/* 우측: 목록, 카드, 신규등록(저채도) */}
      <div className="right">
        <button className="tb-btn ghost" onClick={onList}>목록</button>
        <button className="tb-btn ghost" onClick={onCard}>카드</button>
        <button className="tb-btn primary" onClick={onCreate}>{createLabel}</button>
      </div>
    </div>
  );
}
