import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** API 유틸 (기존 프로젝트의 lib/api 대체 없이 최소 사용) */
async function apiGet<T=any>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`GET ${url} => ${r.status}`);
  return r.json();
}
async function apiPost<T=any>(url: string, body: any): Promise<T> {
  const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`POST ${url} => ${r.status}`);
  return r.json();
}

/** CSV 확실 다운로드(크로스도메인 안전) */
async function exportCsv() {
  try {
    const url = "http://127.0.0.1:8000/engineers/export-csv";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cd = res.headers.get("content-disposition") || "";
    const m = cd.match(/filename\s*=\s*"?([^"]+)"?/i);
    const filename = (m?.[1] ?? "engineers.csv").trim();
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  } catch (e) {
    console.error(e);
    // 최후 수단
    window.open("http://127.0.0.1:8000/engineers/export-csv", "_blank");
  }
}

/** CSV/XLSX 불러오기 → /engineers/import-csv 업서트 */
async function importRowsFromFile(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "csv") {
    const text = await file.text();
    // 매우 단순 CSV 파서(쉼표 포함 케이스는 실제 운영 시 PapaParse 권장)
    const lines = text.replace(/\r\n/g, "\n").split("\n").filter(Boolean);
    const header = (lines.shift() || "").split(",");
    const rows = lines.map(line=>{
      const cols = line.split(",");
      const obj: any = {};
      header.forEach((h,i)=> obj[h.trim()] = (cols[i] ?? "").trim());
      return obj;
    });
    return rows;
  } else if (ext === "xlsx" || ext === "xls") {
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval:"" }) as any[];
    return rows;
  } else {
    throw new Error("지원하지 않는 파일 형식");
  }
}

/** 상태 칩(색상은 기존 팔레트 유지) */
function StatusChip({ value }: { value: string | null }) {
  const v = (value || "").trim();
  const style: React.CSSProperties = {
    display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:12,
    border:"1px solid var(--border, #374151)"
  };
  if (v === "퇴직") style.background = "rgba(220,38,38,.12)";   // 붉은계열 낮은 채도
  else if (v === "퇴사예정") style.background = "rgba(234,179,8,.12)";
  else style.background = "rgba(16,185,129,.12)"; // 재직(저채도 녹)
  return <span style={style}>{v || "—"}</span>;
}

type Row = {
  id:number; engineer_code:string; employee_no:string; name:string; status:string|null;
  joined_at:string|null; retired_at:string|null;
  birth:string|null; address:string|null; phone:string|null; dept:string|null;
  resign_expected_at:string|null; note:string|null;
};

export default function Engineers(){
  const nav = useNavigate();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<""|"재직"|"퇴사예정"|"퇴직">("");
  const [view, setView] = useState<"list"|"card">("list");
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  async function load(){
    setLoading(true);
    try{
      const data = await apiGet<{items:Row[]}>("http://127.0.0.1:8000/engineers?limit=5000");
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); },[]);

  const filtered = useMemo(()=>{
    const keyword = q.trim();
    return items.filter(r=>{
      if (statusFilter && (r.status||"") !== statusFilter) return false;
      if (!keyword) return true;
      const hay = [r.employee_no, r.name, r.dept, r.phone, r.address, r.note].join(" ").toLowerCase();
      return hay.includes(keyword.toLowerCase());
    });
  },[items,q,statusFilter]);

  function toggleAll(checked:boolean){
    const next: Record<number,boolean> = {};
    if (checked) filtered.forEach(r=> next[r.id]=true);
    setSelected(next);
  }
  function toggleOne(id:number, checked:boolean){
    setSelected(prev=> ({...prev, [id]:checked}));
  }
  async function onBulkDelete(){
    const ids = Object.entries(selected).filter(([,_v])=>_v).map(([k])=>Number(k));
    if (ids.length===0) return alert("선택된 항목이 없습니다.");
    if (!confirm(`선택 ${ids.length}건을 삭제할까요?`)) return;
    await apiPost("http://127.0.0.1:8000/engineers/bulk-delete", { ids });
    await load();
    setSelected({});
  }

  async function onImportClick(){
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".csv,.xlsx,.xls";
    inp.onchange = async () => {
      const f = inp.files?.[0]; if(!f) return;
      try{
        const rows = await importRowsFromFile(f);
        // 업서트: 백엔드가 사번(employee_no) 기준 처리
        const shaped = rows.map((r:any)=>({
          employee_no: r.employee_no ?? r["사번"] ?? "",
          name: r.name ?? r["성명"] ?? "",
          status: r.status ?? r["상태"] ?? "",
          joined_at: r.joined_at ?? r["입사일"] ?? "",
          retired_at: r.retired_at ?? r["퇴사일"] ?? ""
        }));
        const res = await apiPost("http://127.0.0.1:8000/engineers/import-csv", { rows: shaped });
        alert(`저장 완료: ${res.saved ?? 0}건`);
        await load();
      }catch(e:any){
        console.error(e);
        alert(e?.message || "불러오기 실패");
      }
    };
    inp.click();
  }

  // 생년월일 표시는 YYYY-MM-DD -> YYYY-MM-DD(앞 10자리) 또는 주민번호에서 앞6자리만 등 정책에 맞게
  function fmtBirth(s:string|null){
    if(!s) return "";
    return s.slice(0,10);
  }

  return (
    <div style={{display:"grid", gap:12}}>
      {/* 툴바 : 좌(검색/상태/선택삭제/내보내기/불러오기) - 우(목록/카드/신규) 한 줄*/}
      <div style={{display:"flex", gap:8, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap"}}>
        <div style={{display:"flex", gap:8, alignItems:"center", flex:1, minWidth:360}}>
          <input
            placeholder="찾기"
            value={q}
            onChange={e=>setQ(e.target.value)}
            style={{flex:1, minWidth:180, padding:"8px 10px", borderRadius:8, border:"1px solid var(--border,#374151)"}}
          />
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}
                  title="상태"
                  style={{padding:"8px 10px", borderRadius:8, border:"1px solid var(--border,#374151)"}}>
            <option value="">상태: 전체</option>
            <option value="재직">재직</option>
            <option value="퇴사예정">퇴사예정</option>
            <option value="퇴직">퇴직</option>
          </select>
          <button onClick={onBulkDelete} style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background:"transparent"}}>
            선택삭제
          </button>
          <button onClick={exportCsv} style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background:"transparent"}}>
            내보내기
          </button>
          <button onClick={onImportClick} style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background:"transparent"}}>
            불러오기
          </button>
        </div>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <button onClick={()=>setView("list")}
                  style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background: view==="list"?"var(--btn-act,#1f2937)":"transparent"}}>
            목록
          </button>
          <button onClick={()=>setView("card")}
                  style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background: view==="card"?"var(--btn-act,#1f2937)":"transparent"}}>
            카드
          </button>
          <button onClick={()=>nav("/engineers/new")}
                  style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border,#374151)", background:"var(--btn-muted,#2b2f36)"}}>
            신규등록
          </button>
        </div>
      </div>

      {/* 목록 / 카드 */}
      {view==="list" ? (
        <div style={{overflow: "auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid var(--border,#374151)"}}>
                <th style={{textAlign:"left", padding:"8px"}}><input type="checkbox"
                  onChange={e=>toggleAll(e.target.checked)}
                  checked={filtered.length>0 && filtered.every(r=>selected[r.id])}
                  indeterminate={undefined}
                /></th>
                <th style={{textAlign:"left", padding:"8px"}}>상태</th>
                <th style={{textAlign:"left", padding:"8px"}}>사번</th>
                <th style={{textAlign:"left", padding:"8px"}}>성명</th>
                <th style={{textAlign:"left", padding:"8px"}}>생년월일</th>
                <th style={{textAlign:"left", padding:"8px"}}>입사일</th>
                <th style={{textAlign:"left", padding:"8px"}}>주소</th>
                <th style={{textAlign:"left", padding:"8px"}}>연락처</th>
                <th style={{textAlign:"left", padding:"8px"}}>부서</th>
                <th style={{textAlign:"left", padding:"8px"}}>퇴사예정일</th>
                <th style={{textAlign:"left", padding:"8px"}}>퇴사일</th>
                <th style={{textAlign:"left", padding:"8px"}}>비고</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} style={{padding:16}}>로딩중…</td></tr>
              ) : filtered.length===0 ? (
                <tr><td colSpan={12} style={{padding:16}}>데이터가 없습니다.</td></tr>
              ) : filtered.map(r=>(
                <tr key={r.id}
                    onDoubleClick={()=>nav(`/engineers/${r.id}`)}
                    style={{borderBottom:"1px solid var(--border,#30363d)", cursor:"default"}}>
                  <td style={{padding:"6px 8px"}}>
                    <input type="checkbox" checked={!!selected[r.id]} onChange={e=>toggleOne(r.id, e.target.checked)}/>
                  </td>
                  <td style={{padding:"6px 8px"}}><StatusChip value={r.status} /></td>
                  <td style={{padding:"6px 8px"}}>{r.employee_no}</td>
                  <td style={{padding:"6px 8px"}}>{r.name}</td>
                  <td style={{padding:"6px 8px"}}>{fmtBirth(r.birth)}</td>
                  <td style={{padding:"6px 8px"}}>{r.joined_at?.slice(0,10) || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.address || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.phone || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.dept || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.resign_expected_at?.slice(0,10) || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.retired_at?.slice(0,10) || ""}</td>
                  <td style={{padding:"6px 8px"}}>{r.note || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:12}}>
          {filtered.map(r=>(
            <div key={r.id} onDoubleClick={()=>nav(`/engineers/${r.id}`)}
                 style={{border:"1px solid var(--border,#374151)", borderRadius:12, padding:12}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                <div style={{fontWeight:600}}>{r.name} <span style={{opacity:.7}}>({r.employee_no})</span></div>
                <StatusChip value={r.status} />
              </div>
              <div style={{fontSize:13, lineHeight:1.6}}>
                <div>생년월일: {fmtBirth(r.birth) || "—"}</div>
                <div>입사일: {r.joined_at?.slice(0,10) || "—"}</div>
                <div>부서: {r.dept || "—"}</div>
                <div>연락처: {r.phone || "—"}</div>
                <div>주소: {r.address || "—"}</div>
                <div>퇴사예정일: {r.resign_expected_at?.slice(0,10) || "—"}</div>
                <div>퇴사일: {r.retired_at?.slice(0,10) || "—"}</div>
                <div>비고: {r.note || "—"}</div>
              </div>
              <div style={{marginTop:10}}>
                <label style={{display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer"}}>
                  <input type="checkbox" checked={!!selected[r.id]} onChange={e=>toggleOne(r.id, e.target.checked)}/>
                  선택
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
