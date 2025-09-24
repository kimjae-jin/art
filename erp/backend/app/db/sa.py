import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# .env 지원(선택)
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/erp")

# SQLAlchemy는 드라이버 지정이 필요: postgresql+psycopg://
if DATABASE_URL.startswith("postgresql://"):
    sa_url = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
else:
    sa_url = DATABASE_URL

engine = create_engine(sa_url, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
