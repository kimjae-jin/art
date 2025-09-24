import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Weekly(){
  return (
    <ListScaffold<Row>
      title="주간회의"
      headers={["회의명","일시/담당"]}
      fetcher={async()=>[
        {id:701,status:"재직",title:"9월4주 기술회의",subtitle:"2025-09-23 10:00",extra:"PM 김대리"},
      ]}
      onOpenDetail={(id)=>alert(`주간회의 상세 진입(ID=${id})`)}
      exporterFilename="weekly.xlsx"
    />
  );
}
