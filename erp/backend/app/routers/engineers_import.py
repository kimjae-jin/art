from fastapi import APIRouter, Body
from sqlalchemy.sql import text
from app.db import SessionLocal

router = APIRouter(prefix="/engineers", tags=["engineers"])

@router.post("/import-csv")
def import_csv(payload: dict = Body(...)):
    rows = payload.get("rows") or []
    if not isinstance(rows, list):
        return {"saved": 0}

    sql = text("""
      INSERT INTO engineers (employee_no, name, status, joined_at, retired_at)
      VALUES (:employee_no, :name, :status, :joined_at, :retired_at)
      ON CONFLICT (employee_no) DO UPDATE
      SET name=EXCLUDED.name,
          status=EXCLUDED.status,
          joined_at=EXCLUDED.joined_at,
          retired_at=EXCLUDED.retired_at
    """)

    saved = 0
    with SessionLocal() as s:
        for r in rows:
            s.execute(sql, {
                "employee_no": (r.get("employee_no") or r.get("사번") or "").strip(),
                "name": (r.get("name") or r.get("성명") or "").strip(),
                "status": (r.get("status") or r.get("상태") or "") or None,
                "joined_at": (r.get("joined_at") or r.get("입사일") or "") or None,
                "retired_at": (r.get("retired_at") or r.get("퇴사일") or "") or None,
            })
            saved += 1
        s.commit()
    return {"saved": saved}
