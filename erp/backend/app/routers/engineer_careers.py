from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional, List
from app.schemas.engineer_career import EngineerCareerBulkIn, EngineerCareerOut
from app.db import get_conn

router = APIRouter(prefix="/engineers", tags=["engineer_careers"])

@router.get("/{engineer_id}/careers", response_model=List[EngineerCareerOut])
def list_careers(engineer_id: int = Path(...), law: Optional[str] = Query(None)):
    sql = """
      SELECT id, engineer_id, company_name, project_name,
             to_char(start_date,'YYYY-MM-DD') as start_date,
             to_char(end_date,'YYYY-MM-DD') as end_date,
             client, amount, law
      FROM engineer_careers_engineering
      WHERE engineer_id = %s
    """
    args = [engineer_id]
    if law in ("건진법","엔산법"):
        sql += " AND law = %s"
        args.append(law)
    sql += " ORDER BY start_date NULLS LAST, id"
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, args)
        rows = cur.fetchall()
    out = []
    for r in rows:
        out.append({
            "id": r[0], "engineer_id": r[1], "company_name": r[2], "project_name": r[3],
            "start_date": r[4], "end_date": r[5], "client": r[6],
            "amount": float(r[7]) if r[7] is not None else None, "law": r[8]
        })
    return out

@router.post("/{engineer_id}/careers/bulk")
def bulk_upsert(engineer_id: int, payload: EngineerCareerBulkIn):
    if payload.law not in ("건진법","엔산법"):
        raise HTTPException(status_code=400, detail="law must be 건진법 or 엔산법")

    insert_sql = """
      INSERT INTO engineer_careers_engineering
        (engineer_id, company_name, project_name, start_date, end_date, client,
         job_field, specialty, duty, position, responsibility, report_type,
         recognition_date, amount, law, project_id)
      VALUES
        (%(engineer_id)s, %(company_name)s, %(project_name)s, %(start_date)s, %(end_date)s, %(client)s,
         %(job_field)s, %(specialty)s, %(duty)s, %(position)s, %(responsibility)s, %(report_type)s,
         %(recognition_date)s, %(amount)s, %(law)s, %(project_id)s)
      ON CONFLICT ON CONSTRAINT uniq_engineer_career DO NOTHING
      RETURNING id;
    """
    saved = 0
    with get_conn() as conn, conn.cursor() as cur:
        for it in payload.items:
            args = dict(
                engineer_id=engineer_id,
                company_name=it.company,
                project_name=it.project_name,
                start_date=it.start_date or None,
                end_date=it.end_date or None,
                client=it.client or None,
                job_field=it.work_type or None,   # 컬럼명/입력명 매핑
                specialty=it.specialty or None,
                duty=it.duty or None,
                position=it.position or None,
                responsibility=it.responsibility or None,
                report_type=it.report_type or None,
                recognition_date=it.recognition_date or None,
                amount=it.amount,
                law=payload.law,
                project_id=it.project_id
            )
            cur.execute(insert_sql, args)
            if cur.rowcount > 0:
                saved += 1
        conn.commit()
    return {"saved": saved}
