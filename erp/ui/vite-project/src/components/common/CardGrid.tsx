import StatusChip from "./StatusChip";

type CardItem = {
  id: number|string;
  title: string;
  subtitle?: string;
  status?: string;
  extra?: string;
  onOpen?: ()=>void;
};

export default function CardGrid({items}:{items:CardItem[]}){
  return (
    <div style={{
      display:"grid", gap:12,
      gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))"
    }}>
      {items.map(it=>(
        <div key={it.id}
             onDoubleClick={it.onOpen}
             style={{
               border:"1px solid var(--border,#26313b)",
               borderRadius:12, padding:12, cursor:"default",
               background:"var(--card-bg,rgba(255,255,255,0.02))"
             }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:700}}>{it.title}</div>
            <StatusChip status={it.status as any}/>
          </div>
          {it.subtitle && <div className="muted" style={{marginBottom:6}}>{it.subtitle}</div>}
          {it.extra && <div style={{fontSize:12,opacity:.8}}>{it.extra}</div>}
          <div style={{fontSize:12,opacity:.6,marginTop:8}}>더블클릭 시 상세</div>
        </div>
      ))}
    </div>
  );
}
