import { useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "../components/Toolbar";

type Row = {
  id: number;
  engineer_code: string;
  employee_no: string;
  name: string;
  status: string;
  joined_at: string|null;
  retired_at: string|null;
  gender: string;
  birth: string;
  address: string;
  phone: string;
  dept: string;
  resign_expected_at: string;
  note: string;
};

async function apiGet<T=any>(url:string){ const r=await fetch(url); if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>; }
async function apiPost<T=any>(url:string, body:any){
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>;
}

export default function Engineers(){
  const [items, setItems] = useState<Row[]>([]);
  const [keyword, setKeyword] = useState("");           // 검색
  const [status, setStatus] = useState<""|"재직"|"퇴사예정"|"퇴사">("");
  const [view, setView] = useState<"list"|"card">("list");
  const [selected, setSelected] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<keyof Row>("id");
  const [sortAsc, setSortAsc] = useState(true);

  const allChecked = selected.length>0 && selected.length===items.length;
  const hasSomeChecked = selected.length>0 && selected.length<items.length;
  const headerCbRef = useRef<HTMLInputElement|null>(null);
  useEffect(()=>{ if(headerCbRef.current){ headerCbRef.current.indeterminate = hasSomeChecked && !allChecked; } },[hasSomeChecked,allChecked]);

  async function load(){
    const p = new URLSearchParams();
    if(keyword) p.set("keyword",keyword);
    if(status)  p.set("status",status);
    const data = await apiGet<{items:Row[]}>(`/engineers?limit=5000&${p.toString()}`);
    setItems(data.items||[]); setSelected([]);
  }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ const t=setTimeout(load,200); return ()=>clearTimeout(t); },[keyword,status]);

  const sorted = useMemo(()=>{
    const c=[...items];
    c.sort((a,b)=>{
      const av=(a[sortKey]??"") as any, bv=(b[sortKey]??"") as any;
      if(av<bv) return sortAsc? -1:1; if(av>bv) return sortAsc? 1:-1; return 0;
    });
    return c;
  },[items,sortKey,sortAsc]);

  function toggleSort(k: keyof Row){ if(sortKey===k) setSortAsc(!sortAsc); else { setSortKey(k); setSortAsc(true); } }
  function toggleAll(ch:boolean){ setSelected(ch ? items.map(x=>x.id) : []); }
  function toggleOne(id:number, ch:boolean){ setSelected(p => ch? [...new Set([...p,id])] : p.filter(x=>x!==id)); }

  async function onBulkDelete(){ if(selected.length===0) return; await apiPost("/engineers/bulk-delete",{ids:selected}); await load(); }

  async function onImport(file: File){
    const text = await file.text();
    const lines = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n").filter(Boolean);
    if(lines.length===0) return;
    const head = lines[0].split(",").map(s=>s.trim().replace(/^"|"$/g,""));
    const rows = lines.slice(1).map(line=>{
      const cols = line.split(",").map(s=>s.trim().replace(/^"|"$/g,""));
      const obj:any={}; head.forEach((h,i)=> obj[h]=cols[i]??"");
      return {
        employee_no: obj["사번"]||obj["employee_no"]||"",
        name:        obj["성명"]||obj["name"]||"",
        status:      obj["상태"]||obj["status"]||"",
        joined_at:   obj["입사일"]||obj["joined_at"]||"",
        retired_at:  obj["퇴사일"]||obj["retired_at"]||"",
      };
    }).filter(r=> (r.employee_no||"").trim()!=="" || (r.name||"").trim()!=="");
    if(rows.length===0) return;
    await apiPost("/engineers/import-csv",{rows}); await load();
  }

  function onCreate(){
    const employee_no=(prompt("사번 (예: hor-001)")||"").trim();
    const name=(prompt("성명")||"").trim();
    if(!employee_no || !name) return;
    apiPost("/engineers/import-csv",{rows:[{employee_no,name,status:"재직"}]}).then(load);
  }

  return (
    <div>
      <Toolbar
        keyword={keyword} onKeyword={setKeyword}
        status={status} onStatus={v=>setStatus(v as any)}
        onBulkDelete={onBulkDelete}
        exportHref="/engineers/export-csv"
        onImport={onImport}
        view={view} onView={setView}
        onCreate={onCreate}
        selectedCount={selected.length}
      />

      {view==="list" ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:36}}>
                  <input type="checkbox" ref={headerCbRef} checked={allChecked} onChange={e=>toggleAll(e.target.checked)} />
                </th>
                <th onDoubleClick={()=>toggleSort("status")}>상태</th>
                <th onDoubleClick={()=>toggleSort("employee_no")}>사번</th>
                <th onDoubleClick={()=>toggleSort("name")}>성명</th>
                <th onDoubleClick={()=>toggleSort("gender")}>성별</th>
                <th onDoubleClick={()=>toggleSort("birth")}>생년월일</th>
                <th onDoubleClick={()=>toggleSort("joined_at")}>입사일</th>
                <th onDoubleClick={()=>toggleSort("address")}>주소</th>
                <th onDoubleClick={()=>toggleSort("phone")}>연락처</th>
                <th onDoubleClick={()=>toggleSort("dept")}>부서</th>
                <th onDoubleClick={()=>toggleSort("resign_expected_at")}>퇴사예정일</th>
                <th onDoubleClick={()=>toggleSort("retired_at")}>퇴사일</th>
                <th onDoubleClick={()=>toggleSort("note")}>비고</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r=>(
                <tr key={r.id} onDoubleClick={()=>alert(`상세: ${r.name}`)}>
                  <td className="td-center">
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={e=>toggleOne(r.id,e.target.checked)} />
                  </td>
                  <td className="td-center"><span className={`chip ${r.status==="퇴사"?"danger":r.status==="퇴사예정"?"warn":"neutral"}`}>{r.status||""}</span></td>
                  <td className="td-left">{r.employee_no}</td>
                  <td className="td-left">{r.name}</td>
                  <td className="td-center">{r.gender}</td>
                  <td className="td-center">{r.birth}</td>
                  <td className="td-center">{r.joined_at||""}</td>
                  <td className="td-left">{r.address}</td>
                  <td className="td-left">{r.phone}</td>
                  <td className="td-left">{r.dept}</td>
                  <td className="td-center">{r.resign_expected_at}</td>
                  <td className="td-center">{r.retired_at||""}</td>
                  <td className="td-left">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards">
          {sorted.map(r=>(
            <div className="card" key={r.id} onDoubleClick={()=>alert(`상세: ${r.name}`)}>
              <div className="card-line"><span className={`chip ${r.status==="퇴사"?"danger":r.status==="퇴사예정"?"warn":"neutral"}`}>{r.status||""}</span></div>
              <div className="card-line"><b>사번</b> {r.employee_no}</div>
              <div className="card-line"><b>성명</b> {r.name}</div>
              <div className="card-line"><b>입사일</b> {r.joined_at||""}</div>
              <div className="card-line"><b>퇴사일</b> {r.retired_at||""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
