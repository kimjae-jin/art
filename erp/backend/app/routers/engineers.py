from fastapi import APIRouter, Query, Body
from sqlalchemy.sql import text
from app.db import SessionLocal

router = APIRouter(prefix="/engineers", tags=["engineers"])

# 공통: 현재 DB에 존재하는 컬럼만 가져오는 SELECT (* 기반)
LIST_SQL = text("""
  SELECT * FROM engineers
  ORDER BY id ASC
  LIMIT :limit OFFSET :offset
""")

@router.get("")
def list_engineers(limit: int = Query(5000, ge=1, le=20000), offset: int = 0):
    with SessionLocal() as s:
        rows = s.execute(LIST_SQL, {"limit": limit, "offset": offset}).mappings().all()
        items = []
        for r in rows:
            d = dict(r)
            # UI 호환을 위해 항상 존재시키는 키
            d.setdefault("status", None)
            d.setdefault("employee_no", None)
            d.setdefault("name", None)
            d.setdefault("joined_at", None)
            d.setdefault("retired_at", None)
            # 아직 DB에 없는 확장키(주소/연락처/부서/비고/퇴사예정일 등)는 프런트에서 '-' 처리
            d.setdefault("birth", None)
            d.setdefault("address", None)
            d.setdefault("phone", None)
            d.setdefault("dept", None)
            d.setdefault("resign_expected_at", None)
            d.setdefault("note", None)
            items.append(d)
        return {"items": items}

# CSV/XLSX Import (rows: [{ 사번/employee_no, 성명/name, 상태/status, 입사일/joined_at, 퇴사일/retired_at }...])
@router.post("/import-csv")
def import_csv(payload: dict = Body(...)):
    rows = payload.get("rows") or []
    if not isinstance(rows, list):
        return {"saved": 0}

    upsert_sql = text("""
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
            s.execute(upsert_sql, {
                "employee_no": (r.get("employee_no") or r.get("사번") or "").strip(),
                "name": (r.get("name") or r.get("성명") or "").strip(),
                "status": (r.get("status") or r.get("상태") or None) or None,
                "joined_at": (r.get("joined_at") or r.get("입사일") or None) or None,
                "retired_at": (r.get("retired_at") or r.get("퇴사일") or None) or None,
            })
            saved += 1
        s.commit()
    return {"saved": saved}

# 선택삭제
@router.post("/bulk-delete")
def bulk_delete(payload: dict = Body(...)):
    ids = payload.get("ids") or []
    if not ids:
        return {"deleted": 0}
    sql = text("DELETE FROM engineers WHERE id = ANY(:ids)")
    with SessionLocal() as s:
        s.execute(sql, {"ids": ids})
        s.commit()
    return {"deleted": len(ids)}