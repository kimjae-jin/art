export default function PageSplit({top, bottom}:{top:React.ReactNode; bottom:React.ReactNode}){
  return (
    <div style={{
      width:"100vw", height:"calc(100vh - 56px)",
      display:"grid", gridTemplateRows:"3fr 7fr", gap:12, padding:16, overflow:"hidden"
    }}>
      <section style={{minHeight:0, overflow:"auto"}}>{top}</section>
      <section style={{minHeight:0, overflow:"auto"}}>{bottom}</section>
    </div>
  );
}
