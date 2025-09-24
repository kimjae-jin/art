import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import TechCareerSection from "../components/TechCareerSection";
import EvidenceUploader from "../components/EvidenceUploader";
import "../theme.css";

type Row = { id:number; employee_no:string; name:string; department?:string|null; address?:string|null;
  birthdate?:string|null; join_date?:string|null; mobile?:string|null; retire_expected?:string|null; retire_date?:string|null; note?:string|null; };

function fmtDate(s?:string|null){ if(!s) return ""; const d=new Date(s as any); if(isNaN(+d)) return ""; const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0"); return `${y}.${m}.${dd}.`; }

export default function EngineerDetail(){
  const { id } = useParams();
  const [item,setItem]=useState<Row|null>(null);
  const [tab,setTab]=useState<string>("basic");
  const [err,setErr]=useState("");

  useEffect(()=>{ (async()=>{
    try{ const d:any = await apiGet(`/engineers/${id}`); setItem(d); }
    catch(e:any){ setErr(e?.message||"로드 실패"); }
  })(); },[id]);

  const TabBtn = ({k,label}:{k:string;label:string}) => (
    <button className="tab" onClick={()=>setTab(k)} aria-pressed={tab===k}>{label}</button>
  );

  return (
    <div className="page">
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <Link to="/engineers" className="btn">← 목록</Link>
        <div className="chip">상세</div>
      </div>

      <div className="detail-wrap">
        <div className="panel" aria-label="상단 기본요약">
          {err? <span style={{color:"#b91c1c"}}>{err}</span> : !item? "로딩…" :
          <div style={{display:"grid", gridTemplateColumns:"180px 1fr 1fr 1fr", gap:12, alignItems:"start"}}>
            <div style={{border:"1px solid var(--border)", borderRadius:8, width:160, height:200, display:"grid", placeItems:"center", overflow:"hidden"}}>
              <span style={{opacity:.6, fontSize:12}}>사진 업로드</span>
            </div>
            <div>
              <div className="muted">사번</div><div className="mono">{item.employee_no}</div>
              <div className="muted" style={{marginTop:8}}>성명</div><div>{item.name}</div>
              <div className="muted" style={{marginTop:8}}>부서</div><div>{item.department||""}</div>
            </div>
            <div>
              <div className="muted">생년월일</div><div>{fmtDate(item.birthdate)}</div>
              <div className="muted" style={{marginTop:8}}>입사일</div><div>{fmtDate(item.join_date)}</div>
              <div className="muted" style={{marginTop:8}}>연락처(끝4)</div><div>{item.mobile||""}</div>
            </div>
            <div>
              <div className="muted">퇴사예정일</div><div>{fmtDate(item.retire_expected)}</div>
              <div className="muted" style={{marginTop:8}}>퇴사일</div><div>{fmtDate(item.retire_date)}</div>
              <div className="muted" style={{marginTop:8}}>주소</div><div>{item.address||""}</div>
            </div>
            <div style={{gridColumn:"1 / span 4", marginTop:8}}>
              <div className="muted">비고</div><div>{item.note||""}</div>
            </div>
          </div>}
        </div>

        <div className="panel" aria-label="하단 탭">
          <div className="tabs">
            <TabBtn k="basic" label="기본정보"/>
            <TabBtn k="grade" label="등급(역량지수)"/>
            <TabBtn k="edu" label="학력"/>
            <TabBtn k="qual" label="자격"/>
            <TabBtn k="training" label="교육훈련"/>
            <TabBtn k="award" label="상훈"/>
            <TabBtn k="workhist" label="근무이력"/>
            <TabBtn k="techcareer" label="기술경력(건설진흥법/엔지니어링산업진흥법)"/>
            <TabBtn k="results" label="실적(타/자회사)"/>
            <TabBtn k="projects" label="프로젝트"/>
            <TabBtn k="licenses" label="면허"/>
            <TabBtn k="overlap" label="업무중첩"/>
            <TabBtn k="memo" label="특이사항"/>
          </div>

          {item && <>
            {tab==="basic" && <SectionBox title="기본정보 증빙"><EvidenceUploader entity="engineer" entityId={item.id} section="basic"/></SectionBox>}
            {tab==="grade" && <SectionGrid title="등급(협회별 역량지수)">
              <SelectRow label="협회"><option value="건설진흥법">건설진흥법</option><option value="엔지니어링산업진흥법">엔지니어링산업진흥법</option></SelectRow>
              <InputRow label="기술등급(자동계산 결과)"/>
              <InputRow label="계산근거/지표"/>
              <EvidenceUploader entity="engineer" entityId={item.id} section="grade"/>
            </SectionGrid>}
            {tab==="edu" && <FormGrid fields={["학교명","전공","학위","입학일","졸업일","비고"]} entityId={item.id} section="edu"/>}
            {tab==="qual" && <FormGrid fields={["자격명","등급","자격번호","취득일","발급기관","비고"]} entityId={item.id} section="qual"/>}
            {tab==="training" && <SectionGrid title="교육훈련(법정 주기)">
              <SelectRow label="구분"><option value="3년차">3년차</option><option value="5년차">5년차</option><option value="기타">기타</option></SelectRow>
              <InputRow label="교육과정"/>
              <InputRow label="기관/시간/이수일"/>
              <EvidenceUploader entity="engineer" entityId={item.id} section="training"/>
            </SectionGrid>}
            {tab==="award" && <FormGrid fields={["구분(포상/징계)","명칭","기관","일자","비고"]} entityId={item.id} section="award"/>}
            {tab==="workhist" && <FormGrid fields={["회사명","부서/직위","입사일","퇴사일","주요업무","비고"]} entityId={item.id} section="workhist"/>}
            {tab==="techcareer" && <TechCareerSection engineerId={item.id}/>}
            {tab==="results" && <SectionGrid title="실적(만10년 경과시 삭제대기)">
              <SelectRow label="구분"><option value="타회사">타회사</option><option value="자회사">자회사</option></SelectRow>
              <InputRow label="프로젝트/발주처/금액/기간(공란 허용)"/>
              <EvidenceUploader entity="engineer" entityId={item.id} section="results"/>
            </SectionGrid>}
            {tab==="projects" && <SectionBox title="프로젝트 증빙"><EvidenceUploader entity="engineer" entityId={item.id} section="projects"/></SectionBox>}
            {tab==="licenses" && <SectionBox title="면허 증빙"><EvidenceUploader entity="engineer" entityId={item.id} section="licenses"/></SectionBox>}
            {tab==="overlap" && <SectionGrid title="업무중첩"><InputRow label="기간/업무내용/중첩근거(공란 허용)"/><EvidenceUploader entity="engineer" entityId={item.id} section="overlap"/></SectionGrid>}
            {tab==="memo" && <SectionGrid title="특이사항"><InputRow label="내용(공란 허용)"/><EvidenceUploader entity="engineer" entityId={item.id} section="memo"/></SectionGrid>}
          </>}
        </div>
      </div>
    </div>
  );
}

function SectionBox({title, children}:{title:string; children:any}){
  return <div style={{display:"grid", gap:8}}>
    <div className="muted">{title}</div>
    <div>{children}</div>
  </div>;
}
function SectionGrid({title, children}:{title:string; children:any}){
  return <div style={{display:"grid", gap:8}}>
    <div className="muted">{title}</div>
    <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8}}>{children}</div>
  </div>;
}
function InputRow({label}:{label:string}){ return <>
  <label className="muted" style={{gridColumn:"span 1"}}>{label}</label>
  <input className="input" style={{gridColumn:"span 2"}} placeholder={label}/>
</>; }
function SelectRow({label, children}:{label:string; children:any}){ return <>
  <label className="muted" style={{gridColumn:"span 1"}}>{label}</label>
  <select className="select" style={{gridColumn:"span 2"}}>{children}</select>
</>; }
function FormGrid({fields, entityId, section}:{fields:string[]; entityId:number; section:string}){
  return (
    <div style={{display:"grid", gap:8}}>
      <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8}}>
        {fields.map((f,i)=>(<><label key={i+"l"} className="muted" style={{gridColumn:"span 1"}}>{f}</label><input key={i+"i"} className="input" style={{gridColumn:"span 2"}} placeholder={f}/></>))}
      </div>
      <EvidenceUploader entity="engineer" entityId={entityId} section={section}/>
    </div>
  );
}
