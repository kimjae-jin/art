import React from "react";
import * as XLSX from "xlsx"; // npm i xlsx
import { apiGet, apiPost } from "../lib/api"; // 기존 프로젝트의 lib/api 사용

type Engineer = {
  id: number;
  employee_no?: string | null;
  name?: string | null;
  status?: string | null;
  joined_at?: string | null;
  retired_at?: string | null;
  // 확장 필드(없으면 '-' 표기)
  birth?: string | null;
  address?: string | null;
  phone?: string | null;
  dept?: string | null;
  resign_expected_at?: string | null;
  note?: string | null;
};

const StatusChip = ({status}:{status?:string|null})=>{
  const s = (status||"").trim();
  const style: React.CSSProperties = {
    padding:"2px 6px", borderRadius:6, fontSize:12, fontWeight:600,
    background:"#334155", color:"#e5e7eb", border:"1px solid #475569"
  };
  if (s==="퇴직") style.background = "#7f1d1d"; // 저채도 레드
  else if (s==="퇴사예정") style.background = "#78350f"; // 브라운
  else if (s==="재직") style.background = "#14532d"; // 그린
  return <span style={style}>{s||"-"}</span>;
};

export default function Engineers(){
  const [items, setItems] = React.useState<Engineer[]>([]);
  const [view, setView] = React.useState<"list"|"card">("list");
  const [q, setQ] = React.useState("");

  const [checked, setChecked] = React.useState<Record<number, boolean>>({});
  const allChecked = items.length>0 && items.every(it=>checked[it.id]);

  const load = async()=>{
    const res = await apiGet("/engineers?limit=5000");
    setItems(res.items || []);
    setChecked({});
  };

  React.useEffect(()=>{ load(); },[]);

  const toggleAll = ()=>{
    if (allChecked) setChecked({});
    else {
      const m: Record<number, boolean> = {};
      items.forEach(it=>m[it.id]=true);
      setChecked(m);
    }
  };

  const onBulkDelete = async()=>{
    const ids = items.filter(it=>checked[it.id]).map(it=>it.id);
    if (!ids.length) return alert("선택된 항목이 없습니다.");
    if (!confirm(`선택 ${ids.length}건을 삭제할까요?`)) return;
    await apiPost("/engineers/bulk-delete", {ids});
    await load();
  };

  const onExportCSV = ()=>{
    const header = ["상태","사번","성명","입사일","퇴사일","생년월일","주소","연락처","부서","퇴사예정일","비고"];
    const rows = items.map(it=>[
      it.status||"", it.employee_no||"", it.name||"", it.joined_at||"", it.retired_at||"",
      it.birth||"", it.address||"", it.phone||"", it.dept||"", it.resign_expected_at||"", (it.note||"")
    ]);
    const csv = [header, ...rows].map(r=>r.map(v=>`"${(v??"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "engineers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onImportFile = async(e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0];
    if (!f) return;
    const name = f.name.toLowerCase();
    let rows: any[] = [];

    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data, {type:"array"});
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws); // 1행 헤더 기준 객체 배열
    } else if (name.endsWith(".csv")) {
      const txt = await f.text();
      const [headerLine, ...lines] = txt.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(",").map(s=>s.replace(/^"|"$/g,"").trim());
      rows = lines.map(line=>{
        const cells = line.split(",").map(s=>s.replace(/^"|"$/g,"").trim());
        const o:any = {};
        headers.forEach((h,i)=>o[h]=cells[i]??"");
        return o;
      });
    } else {
      alert("CSV 또는 XLSX 파일만 지원합니다.");
      return;
    }

    // 서버에 업서트
    const res = await apiPost("/engineers/import-csv", {rows});
    alert(`불러오기 완료: ${res.saved||0}건`);
    e.target.value = "";
    await load();
  };

  const filtered = items.filter(it=>{
    const key = (it.employee_no||"") + " " + (it.name||"") + " " + (it.dept||"") + " " + (it.address||"") + " " + (it.phone||"");
    return key.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div style={{display:"grid", gap:12}}>
      {/* 툴바 */}
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="검색: 사번/성명/부서/연락처/주소"
          style={{flex:"1 1 320px", padding:"8px 10px", border:"1px solid var(--border,#475569)", borderRadius:8, background:"transparent", color:"var(--fg,#e5e7eb)"}}
        />
        <div style={{display:"flex", gap:6}}>
          <button onClick={()=>setView("list")} style={{padding:"6px 10px"}}>목록</button>
          <button onClick={()=>setView("card")} style={{padding:"6px 10px"}}>카드</button>
          <button onClick={load} style={{padding:"6px 10px"}}>새로고침</button>
          <label style={{display:"inline-flex", alignItems:"center", gap:6, padding:"6px 10px", border:"1px solid var(--border,#475569)", borderRadius:8, cursor:"pointer"}}>
            <input type="file" accept=".csv, .xlsx, .xls" onChange={onImportFile} style={{display:"none"}}/>
            불러오기(CSV/XLSX)
          </label>
          <button onClick={onExportCSV} style={{padding:"6px 10px"}}>CSV 내보내기</button>
          <button onClick={onBulkDelete} style={{padding:"6px 10px"}}>선택삭제</button>
          <button onClick={()=>alert("신규등록: 상세 페이지 폼 연결 예정")} style={{padding:"6px 10px"}}>신규 등록</button>
        </div>
      </div>

      {/* 리스트/카드 */}
      {view==="list" ? (
        <div style={{border:"1px solid var(--border,#475569)", borderRadius:8, overflow:"hidden"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead style={{background:"var(--thead,#111827)"}}>
              <tr>
                <th style={{padding:"8px", borderBottom:"1px solid var(--border,#475569)"}}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll}/>
                </th>
                <th style={{padding:"8px"}}>상태</th>
                <th style={{padding:"8px"}}>사번</th>
                <th style={{padding:"8px"}}>성명</th>
                <th style={{padding:"8px"}}>생년월일</th>
                <th style={{padding:"8px"}}>입사일</th>
                <th style={{padding:"8px"}}>주소</th>
                <th style={{padding:"8px"}}>연락처</th>
                <th style={{padding:"8px"}}>부서</th>
                <th style={{padding:"8px"}}>퇴사예정일</th>
                <th style={{padding:"8px"}}>퇴사일</th>
                <th style={{padding:"8px"}}>비고</th>
              </tr>
            </thead>
            <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={12} style={{textAlign:"center", padding:"24px"}}>데이터가 없습니다.</td></tr>
            ) : filtered.map(it=>(
              <tr key={it.id} onDoubleClick={()=>alert(`상세 진입(미연결): id=${it.id}`)}
                style={{borderTop:"1px solid var(--border,#475569)", cursor:"pointer"}}>
                <td style={{padding:"8px"}}>
                  <input type="checkbox" checked={!!checked[it.id]} onChange={e=>setChecked(prev=>({...prev,[it.id]:e.target.checked}))}/>
                </td>
                <td style={{padding:"8px"}}><StatusChip status={it.status}/></td>
                <td style={{padding:"8px"}}>{it.employee_no || "-"}</td>
                <td style={{padding:"8px"}}>{it.name || "-"}</td>
                <td style={{padding:"8px"}}>{it.birth || "-"}</td>
                <td style={{padding:"8px"}}>{it.joined_at || "-"}</td>
                <td style={{padding:"8px"}}>{it.address || "-"}</td>
                <td style={{padding:"8px"}}>{it.phone || "-"}</td>
                <td style={{padding:"8px"}}>{it.dept || "-"}</td>
                <td style={{padding:"8px"}}>{it.resign_expected_at || "-"}</td>
                <td style={{padding:"8px"}}>{it.retired_at || "-"}</td>
                <td style={{padding:"8px"}}>{it.note || "-"}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12}}>
          {filtered.length===0 ? <div className="muted">카드 없음</div> : filtered.map(it=>(
            <div key={it.id} style={{border:"1px solid var(--border,#475569)", borderRadius:10, padding:12}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                <strong>{it.name || "-"}</strong>
                <StatusChip status={it.status}/>
              </div>
              <div style={{fontSize:13, lineHeight:1.6}}>
                <div>사번: {it.employee_no || "-"}</div>
                <div>입사일: {it.joined_at || "-"}</div>
                <div>퇴사일: {it.retired_at || "-"}</div>
                <div>부서: {it.dept || "-"}</div>
                <div>연락처: {it.phone || "-"}</div>
                <div>주소: {it.address || "-"}</div>
              </div>
              <div style={{marginTop:8, display:"flex", gap:6}}>
                <button onClick={()=>alert(`상세 진입(미연결): id=${it.id}`)} style={{padding:"4px 8px"}}>상세</button>
                <label style={{marginLeft:"auto"}}>
                  <input type="checkbox" checked={!!checked[it.id]} onChange={e=>setChecked(prev=>({...prev,[it.id]:e.target.checked}))}/>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}