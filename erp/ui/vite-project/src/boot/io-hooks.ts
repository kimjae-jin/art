function parseCSV(text: string): Record<string,string>[] {
  const lines = text.replace(/\r\n?/g,"\n").split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = split(lines[0]); const out: Record<string,string>[] = [];
  for (let i=1;i<lines.length;i++){
    const cols = split(lines[i]); const o: any = {};
    headers.forEach((h,idx)=>o[h]=cols[idx] ?? ""); out.push(o);
  }
  return out;
  function split(line:string){
    const r:string[]=[], len=line.length; let i=0, q=false, cur="";
    while(i<len){
      const ch=line[i++];
      if(q){ if(ch=='"' && line[i]=='"'){cur+='"'; i++;} else if(ch=='"'){q=false;} else cur+=ch; }
      else { if(ch==','){r.push(cur);cur="";} else if(ch=='"'){q=true;} else cur+=ch; }
    }
    r.push(cur); return r;
  }
}
function downloadBlob(data: Blob, filename: string){
  const url = URL.createObjectURL(data);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}
const API = "http://127.0.0.1:8000";
async function exportCSV(){
  const res = await fetch(`${API}/engineers/export-csv`);
  if(!res.ok) { alert("내보내기 실패"); return; }
  const blob = await res.blob();
  downloadBlob(blob, "engineers.csv");
}
async function importCSVDialog(){
  const input = document.createElement("input");
  input.type = "file"; input.accept = ".csv,text/csv";
  input.onchange = async () => {
    const f = input.files?.[0]; if(!f) return;
    const text = await f.text();
    const rows = parseCSV(text);
    const norm = rows.map((r:any)=>({
      employee_no: r["사번"] ?? r["employee_no"] ?? "",
      name:        r["성명"] ?? r["name"] ?? "",
      status:      r["상태"] ?? r["status"] ?? "",
      joined_at:   r["입사일"] ?? r["joined_at"] ?? "",
      retired_at:  r["퇴사일"] ?? r["retired_at"] ?? "",
      address:     r["주소"] ?? r["address"] ?? "",
      phone:       r["연락처"] ?? r["phone"] ?? "",
      dept:        r["부서"] ?? r["dept"] ?? "",
      resign_expected_at: r["퇴사예정일"] ?? r["resign_expected_at"] ?? "",
      note:        r["비고"] ?? r["note"] ?? "",
    }));
    const r = await fetch(`${API}/engineers/import-csv`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ rows: norm })
    });
    if(!r.ok){ alert("불러오기 실패"); return; }
    (window as any).reloadEngineers?.() ?? location.reload();
    alert("불러오기 완료");
  };
  input.click();
}
function bindOnce(){
  if (!location.pathname.startsWith("/engineers")) return;
  const findBtn = (label:string) => {
    const btns = Array.from(document.querySelectorAll("button, [role='button']")) as HTMLElement[];
    return btns.find(b => (b.textContent||"").replace(/\s+/g," ").includes(label) && !b.dataset._ioBound);
  };
  const ex = findBtn("CSV 내보내기");
  if (ex){ ex.dataset._ioBound="1"; ex.addEventListener("click", (e)=>{ e.preventDefault(); exportCSV(); }); }
  const im = findBtn("불러오기");
  if (im){ im.dataset._ioBound="1"; im.addEventListener("click", (e)=>{ e.preventDefault(); importCSVDialog(); }); }
}
const mo = new MutationObserver(()=> bindOnce());
window.addEventListener("DOMContentLoaded", ()=>{ bindOnce(); mo.observe(document.body,{childList:true,subtree:true}); });
