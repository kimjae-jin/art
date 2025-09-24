/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toCSV, downloadBlob } from "../lib/csv";
import EvidenceUploader from "./EvidenceUploader";
import { apiGet, apiPost } from "../lib/api";

const HEADERS = [
  "연번","업체명","시작일","종료일","인정일","사업명","발주자","공사종류",
  "공법","직무분야","전문분야","담당업무","직위","신고구분","공사개요","책임정도","금액"
] as const;

type Row = Record<(typeof HEADERS)[number], string> & { 프로젝트ID?: string };

function normDate(s: any): string {
  if (s === undefined || s === null || s === "") return "";
  if (s instanceof Date) {
    const [y,m,d] = s.toISOString().split("T")[0].split("-");
    return `${y}.${m}.${d}`;
  }
  if (typeof s === "number") {
    const base = new Date(1900,0,1);
    base.setDate(base.getDate() + (s - 2));
    const [y,m,d] = base.toISOString().split("T")[0].split("-");
    return `${y}.${m}.${d}`;
  }
  if (typeof s === "string") {
    const t = s.trim().replace(/[-/]/g,".").replace(/\.$/,"");
    return t;
  }
  try {
    const x = String(s);
    return x.replace(/[-/]/g,".").replace(/\.$/,"");
  } catch { return ""; }
}
function toISO(s: string){ if(!s) return ""; return s.replace(/[.]/g,"-"); }

function deriveStatus(r: Row): "근무중"|"적용 일시 보류"|"완료" {
  const g = (r["신고구분"]||"").trim();
  if (g === "중지") return "적용 일시 보류";
  if (!r["종료일"] || g === "재개") return "근무중";
  return "완료";
}

function splitCSVLine(s: string){
  const out:string[]=[]; let cur=""; let q=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(c === '"'){ if(q && s[i+1]==='"'){ cur+='"'; i++; } else { q=!q; } continue; }
    if(c === "," && !q){ out.push(cur); cur=""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function parseAmount(x:string){ return Number(String(x||"").replace(/[^\d]/g,"")) || 0; }

export default function TechCareerSection({
  engineerId, defaultCompany
}:{ engineerId: number; defaultCompany?: string; }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [projects, setProjects] = useState<{ project_id: string; name: string }[]>([]);
  const [showInternal, setShowInternal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const company = useMemo(() =>
    (defaultCompany || window.localStorage.getItem("companyName") || "현소속사") as string
  , [defaultCompany]);

  useEffect(() => {
    (async () => {
      const d: any = await apiGet("/projects?limit=5000");
      const arr = Array.isArray(d) ? d : (d?.items || []);
      setProjects(arr.map((x: any) => ({ project_id: x.project_id, name: x.name })));
    })();
  }, []);

  const addRow = () => {
    const base: Row = {
      "연번": String(rows.length + 1),"업체명": company,"시작일":"","종료일":"","인정일":"",
      "사업명":"","발주자":"","공사종류":"","공법":"","직무분야":"","전문분야":"",
      "담당업무":"","직위":"","신고구분":"","공사개요":"","책임정도":"","금액":""
    };
    setRows(prev => [...prev, base]);
  };

  const setCell = (i: number, k: (typeof HEADERS)[number], v: any) => {
    setRows(prev => {
      const n = [...prev]; const r:any = { ...n[i] };
      r[k] = (k==="시작일"||k==="종료일"||k==="인정일") ? normDate(v) : (v ?? "");
      if (!r["업체명"]) r["업체명"] = company;
      n[i] = r; return n;
    });
  };

  const onImport = async (f: File) => {
    try {
      const ext = f.name.toLowerCase().split(".").pop() || "";
      if (ext === "xlsx" || ext === "xls") {
        const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
        const arr: Row[] = json.map(o => {
          const r: any = {}; for (const h of HEADERS) r[h] = (o[h] ?? "");
          r["시작일"] = normDate(r["시작일"]); r["종료일"] = normDate(r["종료일"]); r["인정일"] = normDate(r["인정일"]);
          if (!r["업체명"]) r["업체명"] = company; return r as Row;
        });
        setRows(arr); return;
      }
      if (ext === "csv") {
        const text = await f.text();
        const lines = text.replace(/\r/g,"").split("\n").filter(Boolean);
        const heads = splitCSVLine(lines[0]); const idx = (h:string)=>heads.indexOf(h);
        const arr: Row[] = [];
        for(let i=1;i<lines.length;i++){
          const c = splitCSVLine(lines[i]); const r:any = {};
          for (const h of HEADERS) r[h] = idx(h)>=0 ? (c[idx(h)] ?? "") : "";
          r["시작일"] = normDate(r["시작일"]); r["종료일"] = normDate(r["종료일"]); r["인정일"] = normDate(r["인정일"]);
          if (!r["업체명"]) r["업체명"] = company; arr.push(r as Row);
        }
        setRows(arr); return;
      }
      alert("CSV 또는 XLSX 파일을 선택하세요.");
    } catch (e:any) {
      console.error("IMPORT ERROR:", e);
      alert("불러오기 중 오류가 발생했습니다. 파일 형식을 확인해주세요.");
    }
  };

  const exportCSV = () => {
    const visible = rows.map(r => { const o:any={}; HEADERS.forEach(h => o[h]=r[h]??""); return o; });
    downloadBlob(toCSV(visible as any, HEADERS as unknown as string[]), "tech_career_assoc.csv");
  };
  const exportXLSX = () => {
    const visible = rows.map(r => { const o:any={}; HEADERS.forEach(h => o[h]=r[h]??""); return o; });
    const ws = XLSX.utils.json_to_sheet(visible, { header: HEADERS as unknown as string[] });
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "career");
    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "tech_career_assoc.xlsx");
  };

  const saveRows = async () => {
    if (!rows.length) { alert("저장할 행이 없습니다."); return; }
    const payload = {
      items: rows.map(r => ({
        company: r["업체명"] || "",
        start_date: toISO(r["시작일"]),
        end_date: toISO(r["종료일"]),
        recognition_date: toISO(r["인정일"]),
        project_name: r["사업명"] || "",
        client: r["발주자"] || "",
        work_type: r["공사종류"] || "",
        method: r["공법"] || "",
        job_field: r["직무분야"] || "",
        specialty: r["전문분야"] || "",
        duty: r["담당업무"] || "",
        position: r["직위"] || "",
        report_type: r["신고구분"] || "",
        summary: r["공사개요"] || "",
        responsibility: r["책임정도"] || "",
        amount: parseAmount(r["금액"]),
        project_id: r["프로젝트ID"] || null
      }))
    };
    const res:any = await apiPost(`/engineers/${engineerId}/careers/bulk`, payload);
    alert(`저장 완료: ${res?.saved ?? 0}건`);
  };

  const view = useMemo(() => rows.map(r => ({ ...r, __status: deriveStatus(r) })), [rows]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={addRow}>행 추가</button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx"
          style={{ display: "none" }}
          onChange={e => { const f=e.target.files?.[0]; e.currentTarget.value=""; if (f) onImport(f); }}
        />
        <button className="btn" onClick={() => fileRef.current?.click()}>불러오기(CSV/XLSX)</button>
        <button className="btn" onClick={exportCSV}>CSV 내보내기</button>
        <button className="btn" onClick={exportXLSX}>XLSX 내보내기</button>
        <button className="btn primary" onClick={saveRows}>저장하기</button>
        <div className="spacer" />
        <label className="muted">현 소속사 자동적용: <span className="mono">{company}</span></label>
        <label style={{display:"flex",alignItems:"center",gap:6}}>
          <input type="checkbox" checked={showInternal} onChange={e=>setShowInternal(e.target.checked)} />
          내부연결(프로젝트ID) 보기
        </label>
      </div>

      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th className="th th-head">상태</th>
                {HEADERS.map(h => <th key={h} className="th th-head">{h}</th>)}
                {showInternal && <th className="th th-head">프로젝트ID</th>}
              </tr>
            </thead>
            <tbody>
              {view.map((r:any, i:number) => (
                <tr key={i} className="tr">
                  <td className="td"><span className="chip">{r.__status}</span></td>
                  {HEADERS.map(h => (
                    <td key={h} className="td">
                      <input
                        className="input" placeholder={h} value={r[h] ?? ""}
                        onChange={e => setCell(i, h, e.target.value)}
                        inputMode={h==="금액" ? "numeric" : "text"} style={{width:"100%"}}
                      />
                    </td>
                  ))}
                  {showInternal && (
                    <td className="td">
                      <select
                        className="select"
                        value={rows[i]?.["프로젝트ID"] || ""}
                        onChange={e=>{
                          const v=e.target.value;
                          setRows(prev=>{ const n=[...prev]; n[i] = {...n[i], 프로젝트ID:v}; return n; });
                        }}>
                        <option value="">선택</option>
                        {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_id}</option>)}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div className="muted">증빙 서류(탭 단위 저장, 파일당 최대 5MB)</div>
        <EvidenceUploader entity="engineer" entityId={engineerId} section="techcareer" />
      </div>
    </div>
  );
}
