from __future__ import annotations

import os
import psycopg
from contextlib import contextmanager

# --- psycopg (로우 커넥션) ----------------------------------------------------
PG_USER = os.getenv("PGUSER", "postgres")
PG_PASS = os.getenv("PGPASSWORD", "")
PG_HOST = os.getenv("PGHOST", "127.0.0.1")
PG_PORT = os.getenv("PGPORT", "5432")
PG_DB   = os.getenv("PGDATABASE", "erp")

PG_DSN = f"dbname={PG_DB} user={PG_USER} host={PG_HOST} port={PG_PORT}"
if PG_PASS:
    PG_DSN += f" password={PG_PASS}"

@contextmanager
def get_conn():
    with psycopg.connect(PG_DSN, autocommit=False) as conn:
        yield conn

# --- SQLAlchemy (ORM/세션) -----------------------------------------------------
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg://{PG_USER}:{PG_PASS}@{PG_HOST}:{PG_PORT}/{PG_DB}"
)

engine = create_engine(
    DATABASE_URL,
    future=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    future=True,
)

Base = declarative_base()
