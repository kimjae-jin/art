import ListScaffold from "./_ListScaffold";
type Row = { id:number; status?:string; title:string; subtitle?:string; extra?:string; };
export default function Projects(){
  return (
    <ListScaffold<Row>
      title="프로젝트"
      headers={["프로젝트명","발주처/기간"]}
      fetcher={async()=>[
        {id:101,status:"재직",title:"제주항만개발",subtitle:"제주특별자치도",extra:"2022-01-01~2022-12-31"},
      ]}
      onOpenDetail={(id)=>alert(`프로젝트 상세 진입(ID=${id})`)}
      exporterFilename="projects.xlsx"
    />
  );
}
