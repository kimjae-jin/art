import { useEffect, useMemo, useState, Fragment } from "react";
import Toolbar from "../components/Toolbar";

type Row = {
  id: number;
  employee_no: string;
  name: string;
  status: "" | "재직" | "퇴사예정" | "퇴사";
  joined_at?: string | null;
  retired_at?: string | null;
};

export default function Engineers(){
  const [items, setItems] = useState<Row[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<""|"재직"|"퇴사예정"|"퇴사">("");
  const [selected, setSelected] = useState<number[]>([]);
  const [view, setView] = useState<"list"|"card">("list");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({employee_no:"", name:"", status:"재직", joined_at:"", retired_at:""});

  const fetchList = async ()=>{
    const params = new URLSearchParams();
    params.set("limit","5000");
    if (keyword) params.set("keyword", keyword);
    if (status) params.set("status", status);
    const r = await fetch(`http://127.0.0.1:8000/engineers?${params.toString()}`);
    const j = await r.json();
    setItems(j.items || []);
    setSelected([]);
  };

  useEffect(()=>{ fetchList(); },[]);
  useEffect(()=>{ fetchList(); },[keyword, status]);

  const onBulkDelete = async ()=>{
    if (!selected.length) return;
    await fetch("http://127.0.0.1:8000/engineers/bulk-delete", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ids: selected})
    });
    fetchList();
  };

  const onImport = async (file: File)=>{
    const text = await file.text();
    // CSV 간단 파서: 첫 줄 헤더, 쉼표 기준
    const [h, ...lines] = text.replace(/\r/g,"").split("\n").filter(Boolean);
    const headers = h.split(",").map(s=>s.trim());
    const rows = lines.map(line=>{
      const cols = line.split(",");
      const rec: any = {};
      headers.forEach((k, i)=> rec[k] = (cols[i] ?? "").trim());
      return rec;
    });
    await fetch("http://127.0.0.1:8000/engineers/import-csv", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({rows})
    });
    await fetchList();
  };

  const allChecked = selected.length>0 && selected.length===items.length;
  const hasSomeChecked = selected.length>0 && selected.length<items.length;

  const toggleAll = ()=>{
    if (selected.length) setSelected([]);
    else setSelected(items.map(r=>r.id));
  };

  const toggleOne = (id:number)=>{
    setSelected(prev=> prev.includes(id)? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const exportHref = "http://127.0.0.1:8000/engineers/export-csv";

  const onCreate = ()=>{
    setForm({employee_no:"", name:"", status:"재직", joined_at:"", retired_at:""});
    setShowCreate(true);
  };
  const onSaveCreate = async ()=>{
    const row = {
      "사번": form.employee_no,
      "성명": form.name,
      "상태": form.status,
      "입사일": form.joined_at || "",
      "퇴사일": form.retired_at || ""
    };
    await fetch("http://127.0.0.1:8000/engineers/import-csv", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({rows:[row]})
    });
    setShowCreate(false);
    await fetchList();
  };

  return (
    <div style={{padding:16}}>
      <Toolbar
        keyword={keyword} onKeyword={setKeyword}
        status={status} onStatus={v=>setStatus(v as any)}
        onBulkDelete={onBulkDelete}
        exportHref={exportHref}
        onImport={onImport}
        view={view} onView={setView}
        onCreate={onCreate}
        selectedCount={selected.length}
      />

      {/* 목록 */}
      {view==="list" && (
        <div style={{marginTop:12}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"var(--thead-bg,#f5f7fb)"}}>
                <th style={{padding:"8px", textAlign:"left"}}>
                  <input type="checkbox"
                    checked={allChecked}
                    ref={(el)=>{ if(el) (el as any).indeterminate = hasSomeChecked && !allChecked; }}
                    onChange={toggleAll}
                  />
                </th>
                <th style={{padding:"8px", textAlign:"left"}}>상태</th>
                <th style={{padding:"8px", textAlign:"left"}}>사번</th>
                <th style={{padding:"8px", textAlign:"left"}}>성명</th>
                <th style={{padding:"8px", textAlign:"left"}}>입사일</th>
                <th style={{padding:"8px", textAlign:"left"}}>퇴사일</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r=>(
                <tr key={r.id} style={{borderTop:"1px solid var(--border)"}}>
                  <td style={{padding:"8px"}}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggleOne(r.id)} /></td>
                  <td style={{padding:"8px"}}>{r.status}</td>
                  <td style={{padding:"8px"}}>{r.employee_no}</td>
                  <td style={{padding:"8px"}}>{r.name}</td>
                  <td style={{padding:"8px"}}>{r.joined_at||""}</td>
                  <td style={{padding:"8px"}}>{r.retired_at||""}</td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={6} style={{padding:"16px", opacity:.7}}>데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 카드 */}
      {view==="card" && (
        <div style={{marginTop:12, display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:12}}>
          {items.map(r=>(
            <div key={r.id} style={{border:"1px solid var(--border)", borderRadius:12, padding:12}}>
              <div style={{fontWeight:700}}>{r.name}</div>
              <div style={{opacity:.8}}>{r.employee_no} · {r.status}</div>
              <div style={{opacity:.8}}>입사일 {r.joined_at||"-"} / 퇴사일 {r.retired_at||"-"}</div>
            </div>
          ))}
          {!items.length && <div style={{opacity:.7}}>데이터가 없습니다.</div>}
        </div>
      )}

      {/* 신규등록 모달 */}
      {showCreate && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.4)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999
        }}>
          <div style={{background:"var(--panel-bg,#fff)", color:"var(--fg)", border:"1px solid var(--border)", borderRadius:12, width:420, padding:16}}>
            <div style={{fontWeight:700, marginBottom:12}}>기술인 신규등록</div>
            <div style={{display:"grid", gap:8}}>
              <input placeholder="사번 (예: hor-001)" value={form.employee_no} onChange={e=>setForm({...form, employee_no:e.target.value})}
                     style={{padding:"8px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)"}} />
              <input placeholder="성명" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}
                     style={{padding:"8px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)"}} />
              <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}
                      style={{padding:"8px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)"}}>
                <option value="재직">재직</option>
                <option value="퇴사예정">퇴사예정</option>
                <option value="퇴사">퇴사</option>
              </select>
              <input placeholder="입사일 (YYYY-MM-DD)" value={form.joined_at} onChange={e=>setForm({...form, joined_at:e.target.value})}
                     style={{padding:"8px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)"}} />
              <input placeholder="퇴사일 (YYYY-MM-DD)" value={form.retired_at} onChange={e=>setForm({...form, retired_at:e.target.value})}
                     style={{padding:"8px", border:"1px solid var(--border)", borderRadius:8, background:"var(--input-bg)"}} />
            </div>
            <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:12}}>
              <button onClick={()=>setShowCreate(false)}
                      style={{padding:"8px 12px", border:"1px solid var(--border)", borderRadius:8, background:"transparent"}}>취소</button>
              <button onClick={onSaveCreate}
                      style={{padding:"8px 12px", border:"1px solid var(--border)", borderRadius:8, background:"var(--create-bg,#eceff3)", color:"var(--create-fg,#222)"}}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
