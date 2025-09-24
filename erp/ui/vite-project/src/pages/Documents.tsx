import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Documents(){
  return (
    <ListScaffold<Row>
      title="문서"
      headers={["제목","분류/등록자"]}
      fetcher={async()=>[
        {id:501,status:"재직",title:"기술검토의견서",subtitle:"설계/홍길동",extra:"2025-09-20"},
      ]}
      onOpenDetail={(id)=>alert(`문서 상세 진입(ID=${id})`)}
      exporterFilename="documents.xlsx"
    />
  );
}
