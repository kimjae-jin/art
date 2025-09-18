import sqlite3
import csv
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "app" / "db" / "app.db"
CSV_PATH = Path(__file__).resolve().parents[1] / "engineers.csv"

def main():
    if not CSV_PATH.exists():
        print(f"[ERROR] CSV 파일이 없습니다: {CSV_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 테이블 생성 (없으면 새로 만듦)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS engineers (
        id TEXT PRIMARY KEY,
        name TEXT,
        birth TEXT,
        hire_date TEXT,
        address TEXT,
        phone TEXT,
        department TEXT,
        retire_due TEXT,
        retire_date TEXT,
        note TEXT
    )
    """)

    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        rows = list(reader)

    for row in rows:
        cur.execute("""
        INSERT OR REPLACE INTO engineers
        (id, name, birth, hire_date, address, phone, department, retire_due, retire_date, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row.get("사번"),
            row.get("성명"),
            row.get("생년월일"),
            row.get("입사일"),
            row.get("주소"),
            row.get("전화번호"),
            row.get("부서명"),
            row.get("퇴사예정일"),
            row.get("퇴사일"),
            row.get("비고"),
        ))

    conn.commit()
    conn.close()
    print(f"[INFO] {len(rows)}명의 기술인 데이터를 DB에 반영했습니다.")

if __name__ == "__main__":
    main()
