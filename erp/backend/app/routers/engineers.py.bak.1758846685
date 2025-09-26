from fastapi import APIRouter, Body, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.sql import text
from app.db import SessionLocal
from io import StringIO
import csv

router = APIRouter(prefix="/engineers", tags=["engineers"])

@router.get("")
def list_engineers(limit: int = Query(5000, ge=1, le=10000), offset: int = 0, keyword: str = "", status: str = ""):
    sql = """
        SELECT
          e.id,
          '' AS engineer_code,
          COALESCE(e.employee_no,'') AS employee_no,
          COALESCE(e.name,'')        AS name,
          COALESCE(e.status,'')      AS status,
          e.joined_at,
          e.retired_at,

          ''::text  AS gender,
          ''::text  AS birth,
          ''::text  AS address,
          ''::text  AS phone,
          ''::text  AS dept,
          ''::text  AS resign_expected_at,
          ''::text  AS note
        FROM engineers e
        WHERE (:kw = '' OR e.employee_no ILIKE '%'||:kw||'%' OR e.name ILIKE '%'||:kw||'%')
          AND (:st = '' OR COALESCE(e.status,'') = :st)
        ORDER BY e.id ASC
        LIMIT :limit OFFSET :offset
    """
    with SessionLocal() as s:
        rows = s.execute(text(sql), {"kw": keyword, "st": status, "limit": limit, "offset": offset}).mappings().all()
        return {"items": [dict(r) for r in rows]}

@router.post("/bulk-delete")
def bulk_delete(payload: dict = Body(...)):
    ids = payload.get("ids") or []
    if not ids:
        return {"deleted": 0}
    with SessionLocal() as s:
        res = s.execute(text("DELETE FROM engineers WHERE id = ANY(:ids)"), {"ids": ids})
        s.commit()
        return {"deleted": res.rowcount or 0}

@router.get("/export-csv")
def export_csv():
    with SessionLocal() as s:
        rows = s.execute(text("""
            SELECT
              e.id,
              COALESCE(e.employee_no,'') AS employee_no,
              COALESCE(e.name,'')        AS name,
              COALESCE(e.status,'')      AS status,
              e.joined_at,
              e.retired_at,

              ''::text  AS gender,
              ''::text  AS birth,
              ''::text  AS address,
              ''::text  AS phone,
              ''::text  AS dept,
              ''::text  AS resign_expected_at,
              ''::text  AS note
            FROM engineers e
            ORDER BY e.id ASC
        """)).mappings().all()

        headers = ["번호","사번","성명","성별","생년월일","입사일","주소","연락처","부서","퇴사예정일","퇴사일","비고","상태"]
        si = StringIO()
        w = csv.writer(si)
        w.writerow(headers)
        for r in rows:
            w.writerow([
                r["id"],
                r["employee_no"],
                r["name"],
                r["gender"],
                r["birth"],
                (r["joined_at"].isoformat() if r["joined_at"] else ""),
                r["address"],
                r["phone"],
                r["dept"],
                r["resign_expected_at"],
                (r["retired_at"].isoformat() if r["retired_at"] else ""),
                r["note"],
                r["status"],
            ])

        si.seek(0)
        resp = StreamingResponse(iter([si.getvalue()]), media_type="text/csv; charset=utf-8")
        resp.headers["Content-Disposition"] = "attachment; filename=engineers.csv"
        return resp

@router.post("/import-csv")
def import_csv(payload: dict = Body(...)):
    rows = payload.get("rows") or []
    if not isinstance(rows, list):
        return {"saved": 0}

    upsert = text("""
      INSERT INTO engineers (employee_no, name, status, joined_at, retired_at)
      VALUES (:employee_no, :name, :status, :joined_at, :retired_at)
      ON CONFLICT (employee_no) DO UPDATE
      SET name=EXCLUDED.name,
          status=EXCLUDED.status,
          joined_at=EXCLUDED.joined_at,
          retired_at=EXCLUDED.retired_at
    """)

    def g(v): return (v or "").strip() if isinstance(v, str) else (v or None)
    saved = 0
    with SessionLocal() as s:
        for r in rows:
            s.execute(upsert, {
                "employee_no": g(r.get("employee_no") or r.get("사번")),
                "name":        g(r.get("name")        or r.get("성명")),
                "status":      g(r.get("status")      or r.get("상태")),
                "joined_at":   g(r.get("joined_at")   or r.get("입사일")),
                "retired_at":  g(r.get("retired_at")  or r.get("퇴사일")),
            })
            saved += 1
        s.commit()
    return {"saved": saved}
