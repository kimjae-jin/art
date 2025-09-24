import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Estimates(){
  return (
    <ListScaffold<Row>
      title="견적"
      headers={["견적명","금액/상태"]}
      fetcher={async()=>[
        {id:601,status:"재직",title:"○○항만 설계 견적",subtitle:"150,000,000",extra:"검토중"},
      ]}
      onOpenDetail={(id)=>alert(`견적 상세 진입(ID=${id})`)}
      exporterFilename="estimates.xlsx"
    />
  );
}
