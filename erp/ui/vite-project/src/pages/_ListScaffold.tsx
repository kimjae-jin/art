import { useEffect, useMemo, useRef, useState } from "react";
import ListToolbar from "../components/common/ListToolbar";
import CardGrid from "../components/common/CardGrid";
import StatusChip from "../components/common/StatusChip";
import * as XLSX from "xlsx";
import { toCSV, downloadBlob, exportXLSX } from "../utils/io";

type RowBase = {
  id: number;
  status?: string;  // 항상 좌측 체크박스 다음에 '상태' 컬럼을 붙일 수 있도록
  title: string;    // 리스트 첫번째 주요 텍스트(예: 프로젝트명/문서제목/이름 등)
  subtitle?: string;
  extra?: string;
};

type Props<T extends RowBase> = {
  title: string;
  headers: string[];                // 테이블 헤더(체크박스/상태 제외)
  fetcher: () => Promise<T[]>;      // 데이터 로딩 함수
  onOpenDetail: (id:number)=>void;  // 더블클릭 상세 진입
  importer?: (rows: T[])=>Promise<void>; // 불러오기 저장 함수(선택)
  exporterFilename: string;         // 내보내기 파일명
};

export default function ListScaffold<T extends RowBase>(p: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [view, setView] = useState<"list"|"card">("list");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ (async()=>{
    const d = await p.fetcher(); setItems(d);
  })(); },[]);

  const rows = useMemo(()=>{
    return items.filter(it=>{
      const okStatus = !status || (it.status||"") === status;
      const kw = keyword.trim();
      const okKw = !kw || [it.title, it.subtitle, it.extra].some(v=> (v||"").includes(kw));
      return okStatus && okKw;
    });
  },[items, keyword, status]);

  const allChecked = useMemo(()=>{
    if(!rows.length) return false;
    return rows.every(r=>checked[r.id]);
  },[rows, checked]);

  const toggleAll = (v:boolean)=>{
    const n = {...checked};
    rows.forEach(r=> n[r.id]=v);
    setChecked(n);
  };
  const anyChecked = useMemo(()=> Object.values(checked).some(Boolean), [checked]);

  const onDeleteSelected = ()=>{
    const ids = Object.entries(checked).filter(([_,v])=>v).map(([k])=>Number(k));
    if(!ids.length) return;
    // 여기서는 프레임만: 실제 삭제 API 연결은 각 페이지에서 교체
    setItems(prev => prev.filter(it=> !ids.includes(it.id)));
    setChecked({});
    alert(`선택 삭제 처리(프론트 프레임): ${ids.length}건`);
  };

  const onImport = ()=> fileRef.current?.click();
  const onImportFile = async (f:File)=>{
    if(!p.importer){ alert("불러오기 미구현"); return; }
    const ext = f.name.split(".").pop()?.toLowerCase();
    let rowsAny: any[] = [];
    if(ext==="xlsx"||ext==="xls"){
      const wb = XLSX.read(await f.arrayBuffer(),{type:"array"});
      const ws = wb.Sheets[wb.SheetNames[0]];
      rowsAny = XLSX.utils.sheet_to_json(ws, { defval:"" });
    } else if (ext==="csv"){
      const t = await f.text();
      const lines = t.replace(/\r/g,"").split("\n").filter(Boolean);
      const heads = lines[0].split(",");
      for(let i=1;i<lines.length;i++){
        const c = lines[i].split(",");
        const o:any = {};
        heads.forEach((h,idx)=> o[h]=c[idx]??"");
        rowsAny.push(o);
      }
    } else {
      alert("CSV/XLSX만 지원");
      return;
    }
    await p.importer(rowsAny as T[]);
    const d = await p.fetcher(); setItems(d);
  };

  const onExportCSV = ()=>{
    const body = rows.map(r=>{
      const o:any = { id:r.id, status:r.status, title:r.title, subtitle:r.subtitle, extra:r.extra };
      // 확장시 여기에 더 필드 추가
      return o;
    });
    const csv = toCSV(body, Object.keys(body[0]||{id:null,title:null}));
    downloadBlob(new Blob([csv],{type:"text/csv"}), p.exporterFilename.replace(/\.xlsx$/i,".csv"));
  };
  const onExportXLSX = ()=>{
    const body = rows.map(r=>({ id:r.id, status:r.status, title:r.title, subtitle:r.subtitle, extra:r.extra }));
    exportXLSX(body, Object.keys(body[0]||{id:null,title:null}), p.exporterFilename);
  };

  return (
    <div style={{display:"grid", gap:10}}>
      <ListToolbar
        keyword={keyword} onKeyword={setKeyword}
        status={status} onStatus={setStatus}
        onImport={onImport} onExportCSV={onExportCSV} onExportXLSX={onExportXLSX}
        onNew={()=>alert("신규등록(프레임): 상세 입력 폼 연결 필요")}
        anyChecked={anyChecked} onDeleteSelected={onDeleteSelected}
      />
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <div className="muted" style={{fontWeight:700}}>{p.title}</div>
        <div className="spacer" />
        <div className="segmented">
          <button className={view==="list"?"seg active":"seg"} onClick={()=>setView("list")}>목록보기</button>
          <button className={view==="card"?"seg active":"seg"} onClick={()=>setView("card")}>카드보기</button>
        </div>
      </div>

      {view==="list" ? (
        <div style={{overflow:"auto", border:"1px solid var(--border,#26313b)", borderRadius:8}}>
          <table className="table">
            <thead>
              <tr>
                <th className="th th-head" style={{width:40}}>
                  <input type="checkbox" checked={allChecked} onChange={e=>toggleAll(e.target.checked)} />
                </th>
                <th className="th th-head" style={{width:100}}>상태</th>
                {p.headers.map(h=> <th key={h} className="th th-head">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} className="tr" onDoubleClick={()=>p.onOpenDetail(r.id)} style={{cursor:"default"}}>
                  <td className="td">
                    <input type="checkbox" checked={!!checked[r.id]} onChange={e=>setChecked({...checked,[r.id]:e.target.checked})}/>
                  </td>
                  <td className="td"><StatusChip status={r.status as any}/></td>
                  <td className="td mono">{r.title}</td>
                  <td className="td">{r.subtitle || ""}</td>
                  <td className="td">{r.extra || ""}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td className="td" colSpan={3+p.headers.length}>데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <CardGrid items={rows.map(r=>({
          id:r.id, title:r.title, subtitle:r.subtitle, extra:r.extra, status:r.status,
          onOpen: ()=>p.onOpenDetail(r.id)
        }))}/>
      )}

      <input ref={fileRef} type="file" accept=".csv,.xlsx" style={{display:"none"}}
             onChange={e=>{const f=e.target.files?.[0]; e.currentTarget.value=""; if(f) onImportFile(f);}} />
    </div>
  );
}
