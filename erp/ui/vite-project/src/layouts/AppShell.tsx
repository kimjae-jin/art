import Header from "../components/Header";
import "../theme.css";
export default function AppShell({children}:{children:React.ReactNode}){
  return (
    <div style={{width:"100vw", height:"100vh", display:"flex", flexDirection:"column"}}>
      <Header/>
      <main style={{width:"100vw", height:"calc(100vh - 56px)", overflow:"hidden"}}>
        {children}
      </main>
    </div>
  );
}
