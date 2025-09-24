import { useEffect, useState } from "react";
import Header from "./Header";
type Row = { id:number; engineer_code:string|null; employee_no:string; name:string; birthdate:string|null; mobile:string|null };
export default function Engineers(){
  const [items,setItems]=useState<Row[]>([]);
  useEffect(()=>{ fetch("http://127.0.0.1:8000/engineers").then(r=>r.json()).then(d=>setItems(d.items||[])).catch(()=>{}); },[]);
  return (
    <div style={{display:"grid", gridTemplateRows:"3fr 7fr", height:"100vh"}}>
      <div><Header/></div>
      <div style={{padding:16, overflow:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={{textAlign:"left", borderBottom:"1px solid #eee", padding:"8px"}}>사번</th>
              <th style={{textAlign:"left", borderBottom:"1px solid #eee", padding:"8px"}}>성명</th>
              <th style={{textAlign:"left", borderBottom:"1px solid #eee", padding:"8px"}}>생년월일</th>
              <th style={{textAlign:"left", borderBottom:"1px solid #eee", padding:"8px"}}>연락처(끝4)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r=>(
              <tr key={r.id}>
                <td style={{borderBottom:"1px solid #f2f2f2", padding:"8px"}}>{r.employee_no}</td>
                <td style={{borderBottom:"1px solid #f2f2f2", padding:"8px"}}>{r.name}</td>
                <td style={{borderBottom:"1px solid #f2f2f2", padding:"8px"}}>{r.birthdate||""}</td>
                <td style={{borderBottom:"1px solid #f2f2f2", padding:"8px"}}>{r.mobile||""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
