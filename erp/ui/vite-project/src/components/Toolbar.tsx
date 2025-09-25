import type { ChangeEvent } from "react";

type ViewMode = "list" | "card";

type Props = {
  keyword: string;
  onKeyword: (v: string) => void;
  status: "" | "재직" | "퇴사예정" | "퇴사";
  onStatus: (v: string) => void;
  onBulkDelete: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
  exportHref: string;                 // CSV 내보내기 링크
  view: ViewMode;                     // 목록/카드
  onView: (v: ViewMode) => void;
  onCreate: () => void;               // 신규등록
  selectedCount: number;              // 선택 개수 표시
};

export default function Toolbar({
  keyword, onKeyword,
  status, onStatus,
  onBulkDelete,
  onImport,
  exportHref,
  view, onView,
  onCreate,
  selectedCount
}: Props) {

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onImport(f);
    // 같은 파일 다시 선택해도 change 발생하도록 리셋
    e.target.value = "";
  };

  return (
    <div className="tb-wrap">
      <div className="tb-left">
        <input
          className="tb-input"
          placeholder="검색"
          value={keyword}
          onChange={(e)=>onKeyword(e.target.value)}
        />

        <select
          className="tb-select"
          value={status}
          onChange={(e)=>onStatus(e.target.value as Props["status"])}
        >
          <option value="">상태</option>
          <option value="재직">재직</option>
          <option value="퇴사예정">퇴사예정</option>
          <option value="퇴사">퇴사</option>
        </select>

        <button
          className="tb-btn"
          onClick={onBulkDelete}
          disabled={selectedCount === 0}
          title={selectedCount ? `${selectedCount}개 삭제` : "선택 항목 없음"}
        >
          선택삭제
        </button>

        <a className="tb-btn"
           href={exportHref}
           download>
          CSV 내보내기
        </a>

        <label className="tb-btn">
          불러오기
          <input type="file" accept=".csv" onChange={onFile} hidden />
        </label>
      </div>

      <div className="tb-right">
        <div className="seg">
          <button
            className={`seg-btn ${view==="list"?"on":""}`}
            onClick={()=>onView("list")}
          >목록</button>
          <button
            className={`seg-btn ${view==="card"?"on":""}`}
            onClick={()=>onView("card")}
          >카드</button>
        </div>

        <button className="tb-btn create" onClick={onCreate}>
          신규등록
        </button>
      </div>
    </div>
  );
}
