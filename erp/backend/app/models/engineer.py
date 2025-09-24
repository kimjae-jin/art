from __future__ import annotations
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, Date
from app.db import Base

class Engineer(Base):
    __tablename__ = "engineers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    employee_no: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str | None] = mapped_column(Text)
    joined_at: Mapped[date | None] = mapped_column(Date)
    retired_at: Mapped[date | None] = mapped_column(Date)
