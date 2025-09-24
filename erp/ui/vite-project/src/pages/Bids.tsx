import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Bids(){
  return (
    <ListScaffold<Row>
      title="입찰"
      headers={["공고명","기한"]}
      fetcher={async()=>[
        {id:401,status:"재직",title:"○○시설공사 입찰",subtitle:"조달청",extra:"마감 2025-10-31"},
      ]}
      onOpenDetail={(id)=>alert(`입찰 상세 진입(ID=${id})`)}
      exporterFilename="bids.xlsx"
    />
  );
}
