import sys, os, re, glob
import pandas as pd

ROOT = os.path.expanduser("~/Desktop/Art")
DATA_DIR = os.path.join(ROOT, "data")
os.makedirs(DATA_DIR, exist_ok=True)

CANDIDATES = []
for p in glob.glob(os.path.join(ROOT, "*.csv")):
    CANDIDATES.append(p)
CANDIDATES = sorted(CANDIDATES, key=lambda x: (
    0 if re.search(r'(engineer|기술인|인원|인사|사원)', os.path.basename(x), re.I) else 1,
    os.path.getmtime(x) * -1
))

src = None
if len(sys.argv) > 1:
    cand = os.path.abspath(sys.argv[1])
    if os.path.isfile(cand):
        src = cand
if not src:
    if not CANDIDATES:
        print("CSV_NOT_FOUND")
        sys.exit(2)
    src = CANDIDATES[0]

encodings = ["utf-8-sig","utf-8","cp949","euc-kr"]
df = None
err = None
for enc in encodings:
    try:
        df = pd.read_csv(src, encoding=enc)
        break
    except Exception as e:
        err = e
if df is None:
    print(f"CSV_READ_ERROR:{type(err).__name__}:{err}")
    sys.exit(3)

def norm(s):
    return re.sub(r'[\s\-/_.]+','', str(s).strip().lower())

alias = {
    "engineer_id": {"engineerid","engid","id","기술인id","기술인코드"},
    "employee_no": {"employeeno","empno","사번","직원번호"},
    "name": {"name","성명","이름"},
    "birthdate": {"birthdate","생년월일","dob"},
    "join_date": {"joindate","입사일"},
    "retire_date": {"retiredate","퇴사일","퇴직일"},
    "grade": {"grade","기술등급","등급"},
    "department": {"department","부서","부문"},
    "position": {"position","직급","직위"},
    "mobile": {"mobile","휴대전화","휴대폰","연락처","전화번호","핸드폰"},
    "email": {"email","이메일","메일"},
    "address": {"address","주소"},
    "license_no": {"licenseno","자격번호","면허번호","기술인번호"},
    "note": {"note","비고","메모"}
}

required = ["name","employee_no","birthdate"]
recommended = ["mobile","email","department","position","grade","address","join_date"]

colmap = {}
src_cols = list(df.columns)
norm_src = {norm(c): c for c in src_cols}

for canon, alts in alias.items():
    for a in alts | {canon}:
        n = norm(a)
        if n in norm_src:
            colmap[canon] = norm_src[n]
            break

missing_req = [c for c in required if c not in colmap]
present = sorted(colmap.keys())
extra = [c for c in src_cols if norm(c) not in set(norm(x) for x in colmap.values())]

df_norm = pd.DataFrame()
for canon in (list(alias.keys())):
    if canon in colmap:
        df_norm[canon] = df[colmap[canon]]
    else:
        df_norm[canon] = pd.Series([None]*len(df))

def to_date(s):
    if pd.isna(s): return None
    t = str(s).strip()
    if not t: return None
    for fmt in ["%Y-%m-%d","%Y/%m/%d","%Y.%m.%d","%Y%m%d","%y-%m-%d","%y/%m/%d","%y.%m.%d"]:
        try:
            return pd.to_datetime(t, format=fmt, errors="raise").date()
        except Exception:
            pass
    try:
        return pd.to_datetime(t, errors="coerce").date()
    except Exception:
        return None

for c in ["birthdate","join_date","retire_date"]:
    if c in df_norm:
        df_norm[c] = df_norm[c].apply(to_date)

if "engineer_id" not in colmap:
    base = []
    if "employee_no" in colmap:
        base = df_norm["employee_no"].astype(str).fillna("")
    elif "name" in colmap and "birthdate" in colmap:
        base = (df_norm["name"].astype(str).fillna("") + "_" + df_norm["birthdate"].astype(str).fillna(""))
    else:
        base = pd.Series([f"ENG{str(i+1).zfill(6)}" for i in range(len(df_norm))])
    df_norm["engineer_id"] = ["ENG_" + re.sub(r'[^0-9A-Za-z]+','', str(x)) if str(x) else f"ENG{str(i+1).zfill(6)}" for i,x in enumerate(base)]

report = []
report.append(f"SRC_FILE:{src}")
report.append(f"ROWS:{len(df_norm)}")
report.append("PRESENT:" + ",".join(present))
report.append("MISSING_REQ:" + ",".join(missing_req) if missing_req else "MISSING_REQ:")
warn = [c for c in recommended if c not in present]
report.append("MISSING_RECOMMENDED:" + ",".join(warn) if warn else "MISSING_RECOMMENDED:")

preview = df_norm.head(5).to_dict(orient="records")

out_csv = os.path.join(DATA_DIR, "engineers_normalized.csv")
df_norm.to_csv(out_csv, index=False, encoding="utf-8-sig")

out_report = os.path.join(DATA_DIR, "engineers_check_report.txt")
with open(out_report, "w", encoding="utf-8") as f:
    for line in report:
        f.write(line + "\n")
    f.write("PREVIEW:\n")
    for row in preview:
        f.write(str(row) + "\n")

print("\n".join(report))
print(f"NORMALIZED_CSV:{out_csv}")
print(f"REPORT_TXT:{out_report}")

if missing_req:
    sys.exit(1)
sys.exit(0)
