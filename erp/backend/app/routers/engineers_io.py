from fastapi import APIRouter, Body, Response
from sqlalchemy.sql import text
from app.db import SessionLocal
import csv, io
from datetime import date, datetime

router = APIRouter(prefix="/engineers", tags=["engineers-io"])

K_HEADERS = ["상태","사번","성명","생년월일","입사일","주소","연락처","부서","퇴사예정일","퇴사일","비고"]
# DB 컬럼 매핑 (읽기/쓰기 공용)
MAP_IN = {
  "상태":"status","사번":"employee_no","성명":"name","생년월일":"birth",
  "입사일":"joined_at","주소":"address","연락처":"phone","부서":"dept",
  "퇴사예정일":"resign_expected_at","퇴사일":"retired_at","비고":"note",
  # 영문 헤더가 섞여 들어와도 수용
  "status":"status","employee_no":"employee_no","name":"name","birth":"birth",
  "joined_at":"joined_at","address":"address","phone":"phone","dept":"dept",
  "resign_expected_at":"resign_expected_at","retired_at":"retired_at","note":"note"
}

def _is_numberlike(v: str) -> bool:
    v = (v or "").strip()
    if not v: return False
    # 순수 숫자/부동소수/-,+ 허용
    try:
        float(v.replace(",",""))
        return True
    except:
        return False

def _to_str(v):
    if v is None: return ""
    if isinstance(v, (date, datetime)):
        return v.isoformat()[:10]
    return str(v)

def _with_hor_prefix(v: str) -> str:
    """숫자형이면 hor- 접두사 부여"""
    s = _to_str(v)
    return f"hor-{s}" if _is_numberlike(s) else s

def _with_hash_for_empno(v: str) -> str:
    s = _to_str(v)
    if not s: return s
    return s if s.startswith("#") else f"#{s}"

@router.get("/export-csv")
def export_csv():
    sql = text("""
      SELECT status, employee_no, name, birth, joined_at, address, phone, dept,
             resign_expected_at, retired_at, note
      FROM engineers
      ORDER BY id ASC
    """)
    with SessionLocal() as s:
        rows = s.execute(sql).all()

    buf = io.StringIO()
    w = csv.writer(buf)
    # 한글 헤더 고정
    w.writerow(K_HEADERS)

    for r in rows:
        r = list(r)
        # 인덱스 매칭: status(0), employee_no(1)...
        # 사번은 # 접두사, 모든 숫자형 값은 hor- 접두사
        status = _with_hor_prefix(r[0])
        empno  = _with_hash_for_empno(r[1])
        name   = r[2]
        birth  = _with_hor_prefix(_to_str(r[3]))
        joined = _with_hor_prefix(_to_str(r[4]))
        addr   = r[5]
        phone  = _with_hor_prefix(_to_str(r[6]))
        dept   = r[7]
        resign = _with_hor_prefix(_to_str(r[8]))
        retire = _with_hor_prefix(_to_str(r[9]))
        note   = r[10]
        w.writerow([status, empno, name, birth, joined, addr, phone, dept, resign, retire, note])

    csv_bytes = buf.getvalue().encode("utf-8-sig")
    headers = {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="engineers.csv"',
    }
    return Response(content=csv_bytes, media_type="text/csv", headers=headers)

@router.post("/import-csv")
def import_csv(payload: dict = Body(...)):
    """rows: [{...}] 또는 csvText: string(utf-8-sig) 모두 허용"""
    rows = payload.get("rows")
    csv_text = payload.get("csvText")

    def normalize_cell(k, v):
        if v is None: return None
        s = str(v).strip()
        # 사번에서 # 제거
        if MAP_IN.get(k) == "employee_no" and s.startswith("#"):
            s = s[1:]
        # hor- 접두사는 제거하고 원시값 저장(날짜/숫자는 그대로 문자열로 둠)
        if s.startswith("hor-"):
            s = s[4:]
        return s or None

    to_save = []
    if isinstance(rows, list):
        for r in rows:
            rec = {}
            for k, v in r.items():
                key = MAP_IN.get(k)
                if key:
                    rec[key] = normalize_cell(k, v)
            to_save.append(rec)
    elif isinstance(csv_text, str) and csv_text.strip():
        txt = io.StringIO(csv_text)
        reader = csv.DictReader(txt)
        for r in reader:
            rec = {}
            for k, v in r.items():
                key = MAP_IN.get(k)
                if key:
                    rec[key] = normalize_cell(k, v)
            to_save.append(rec)
    else:
        return {"saved": 0}

    sql = text("""
      INSERT INTO engineers
      (status, employee_no, name, birth, joined_at, address, phone, dept,
       resign_expected_at, retired_at, note)
      VALUES (:status, :employee_no, :name, :birth, :joined_at, :address, :phone, :dept,
              :resign_expected_at, :retired_at, :note)
      ON CONFLICT (employee_no) DO UPDATE SET
        status=EXCLUDED.status,
        name=EXCLUDED.name,
        birth=EXCLUDED.birth,
        joined_at=EXCLUDED.joined_at,
        address=EXCLUDED.address,
        phone=EXCLUDED.phone,
        dept=EXCLUDED.dept,
        resign_expected_at=EXCLUDED.resign_expected_at,
        retired_at=EXCLUDED.retired_at,
        note=EXCLUDED.note
    """)
    saved = 0
    with SessionLocal() as s:
        for r in to_save:
            args = {
              "status": r.get("status"), "employee_no": r.get("employee_no"),
              "name": r.get("name"), "birth": r.get("birth"),
              "joined_at": r.get("joined_at"), "address": r.get("address"),
              "phone": r.get("phone"), "dept": r.get("dept"),
              "resign_expected_at": r.get("resign_expected_at"),
              "retired_at": r.get("retired_at"), "note": r.get("note")
            }
            s.execute(sql, args)
            saved += 1
        s.commit()
    return {"saved": saved}
