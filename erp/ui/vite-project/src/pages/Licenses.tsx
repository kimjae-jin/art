import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Licenses(){
  return (
    <ListScaffold<Row>
      title="면허"
      headers={["면허명","유효기간"]}
      fetcher={async()=>[
        {id:201,status:"재직",title:"엔지니어링사업자면허",subtitle:"종합",extra:"유효 ~ 2027-12-31"},
      ]}
      onOpenDetail={(id)=>alert(`면허 상세 진입(ID=${id})`)}
      exporterFilename="licenses.xlsx"
    />
  );
}
