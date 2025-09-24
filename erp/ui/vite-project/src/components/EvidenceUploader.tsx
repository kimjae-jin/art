import { useRef, useState } from "react";
export default function EvidenceUploader({entity, entityId, section}:{entity:string; entityId:number|string; section:string}) {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const add = (f?: File) => {
    if (!f) return;
    if (f.size > 5*1024*1024) { alert("파일당 최대 5MB"); return; }
    setFiles(prev => [...prev, f]); // 실제 업로드 연결 전까지 스텁
  };
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
      <input ref={ref} type="file" style={{display:"none"}}
             onChange={e=>{const f=e.target.files?.[0]; e.currentTarget.value=""; add(f);}}/>
      <button className="btn" onClick={()=>ref.current?.click()}>증빙 추가</button>
      <span className="muted">파일당 5MB, 저장은 추후 업로드 엔드포인트 연결</span>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {files.map((f,i)=><span key={i} className="chip">{f.name}</span>)}
      </div>
    </div>
  );
}
