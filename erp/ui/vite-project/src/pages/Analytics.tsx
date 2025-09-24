import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Analytics(){
  return (
    <ListScaffold<Row>
      title="분석"
      headers={["리포트","기간"]}
      fetcher={async()=>[
        {id:801,status:"재직",title:"기술인 배치 현황",subtitle:"월간",extra:"2025-09"},
      ]}
      onOpenDetail={(id)=>alert(`분석 상세 진입(ID=${id})`)}
      exporterFilename="analytics.xlsx"
    />
  );
}
