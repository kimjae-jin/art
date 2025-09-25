import React from "react";

type Props = {
  search: string;
  onSearch: (v: string) => void;
  onNew?: () => void;
  onImport?: (file: File) => void;
  onExport?: () => void;
  onBulkDelete?: () => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
};

export default function PageToolbar({
  search, onSearch,
  onNew, onImport, onExport, onBulkDelete, onRefresh,
  searchPlaceholder="검색…"
}: Props){
  const fileRef = React.useRef<HTMLInputElement>(null);

  const pickFile = ()=> fileRef.current?.click();
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0];
    if (f && onImport) onImport(f);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="toolbar" style={{marginBottom:10}}>
      <input
        className="grow"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e)=>onSearch(e.target.value)}
      />
      <button className="btn" onClick={onRefresh}>새로고침</button>
      <button className="btn" onClick={onBulkDelete}>선택삭제</button>
      <button className="btn" onClick={onExport}>CSV 내보내기</button>
      <button className="btn" onClick={pickFile}>불러오기(CSV/XLSX)</button>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{display:"none"}} onChange={handleFile}/>
      <button className="btn primary" onClick={onNew}>신규 등록</button>
    </div>
  );
}
