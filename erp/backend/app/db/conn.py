from contextlib import contextmanager
import os
from typing import Iterator

try:
    import psycopg
except ImportError as e:
    raise RuntimeError("psycopg가 필요합니다. (pip install 'psycopg[binary]')") from e

# .env 지원(선택)
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/erp")

@contextmanager
def get_conn() -> Iterator["psycopg.Connection"]:
    conn = psycopg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()
