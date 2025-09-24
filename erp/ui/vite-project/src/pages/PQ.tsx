import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function PQ(){
  return (
    <ListScaffold<Row>
      title="PQ"
      headers={["사업명","점수/등급"]}
      fetcher={async()=>[
        {id:301,status:"재직",title:"○○도로확장 PQ",subtitle:"점수: 92.5",extra:"A등급"},
      ]}
      onOpenDetail={(id)=>alert(`PQ 상세 진입(ID=${id})`)}
      exporterFilename="pq.xlsx"
    />
  );
}
