from fastapi import APIRouter, Body
from starlette.responses import StreamingResponse, JSONResponse
from sqlalchemy import text
from app.db import SessionLocal
import io, csv, urllib.parse

router = APIRouter(prefix="/engineers", tags=["engineers"])

# 목록
@router.get("")
def list_engineers(limit: int = 5000, offset: int = 0, keyword: str = "", status: str = ""):
    where = ["1=1"]
    params = {"limit": limit, "offset": offset}
    if keyword:
        where.append("(e.employee_no ILIKE :kw OR e.name ILIKE :kw)")
        params["kw"] = f"%{keyword}%"
    if status:
        where.append("COALESCE(e.status,'') = :st")
        params["st"] = status
    sql = text(f"""
        SELECT
          e.id,
          e.employee_no,
          e.name,
          COALESCE(e.status,'') AS status,
          e.joined_at,
          e.retired_at
        FROM engineers e
        WHERE {" AND ".join(where)}
        ORDER BY e.id ASC
        LIMIT :limit OFFSET :offset
    """)
    with SessionLocal() as s:
        rows = s.execute(sql, params).mappings().all()
    return {"items":[dict(r) for r in rows]}

# 선택 삭제
@router.post("/bulk-delete")
def bulk_delete(payload: dict = Body(...)):
    ids = payload.get("ids") or []
    if not ids: return {"deleted": 0}
    sql = text("DELETE FROM engineers WHERE id = ANY(:ids)")
    with SessionLocal() as s:
        s.execute(sql, {"ids": ids})
        s.commit()
    return {"deleted": len(ids)}

# CSV 불러오기(업서트) - 한글/영문 헤더 모두 지원, 'hor-' 프리픽스 강제
@router.post("/import-csv")
def import_csv(payload: dict = Body(...)):
    rows = payload.get("rows") or []
    if not isinstance(rows, list): return {"saved": 0}

    def g(d, *keys, default=""):
        for k in keys:
            if k in d and d[k] not in (None, ""):
                return str(d[k]).strip()
        return default

    upsert = text("""
      INSERT INTO engineers (employee_no, name, status, joined_at, retired_at)
      VALUES (:employee_no, :name, NULLIF(:status,''), NULLIF(:joined_at,''), NULLIF(:retired_at,''))
      ON CONFLICT (employee_no) DO UPDATE
      SET name=EXCLUDED.name,
          status=EXCLUDED.status,
          joined_at=EXCLUDED.joined_at,
          retired_at=EXCLUDED.retired_at
    """)

    saved = 0
    with SessionLocal() as s:
        for r in rows:
            emp = g(r, "employee_no", "사번")
            if emp and not emp.startswith("hor-"):
                emp = "hor-" + emp
            name = g(r, "name", "성명")
            status = g(r, "status", "상태")
            joined = g(r, "joined_at", "입사일")
            retired = g(r, "retired_at", "퇴사일")
            if not emp or not name:
                # 핵심 필수 미존재는 스킵
                continue
            s.execute(upsert, {
                "employee_no": emp,
                "name": name,
                "status": status,
                "joined_at": joined,
                "retired_at": retired
            })
            saved += 1
        s.commit()
    return {"saved": saved}

# CSV 내보내기 — 한글 헤더 + UTF-8 + 다운로드 강제
@router.get("/export-csv")
def export_csv():
    # CSV 본문 생성 (UTF-8 BOM 포함: 엑셀 호환)
    output = io.StringIO()
    output.write("\ufeff")  # BOM
    writer = csv.writer(output)
    # 한글 헤더
    writer.writerow(["번호","사번","성명","상태","입사일","퇴사일"])
    with SessionLocal() as s:
        rows = s.execute(text("""
            SELECT id, employee_no, name, COALESCE(status,''), joined_at, retired_at
            FROM engineers
            ORDER BY id ASC
        """)).all()
    for row in rows:
        writer.writerow([row[0], row[1], row[2], row[3], row[4] or "", row[5] or ""])
    csv_bytes = io.BytesIO(output.getvalue().encode("utf-8"))

    # 파일명 RFC5987 처리(한글 안전)
    filename = "기술인목록.csv"
    dispo = f"attachment; filename*=UTF-8''{urllib.parse.quote(filename)}"

    resp = StreamingResponse(csv_bytes, media_type="text/csv; charset=utf-8")
    resp.headers["Content-Disposition"] = dispo
    # 일부 브라우저에서 파일명 헤더 접근 허용
    resp.headers["Access-Control-Expose-Headers"] = "Content-Disposition"
    return resp
