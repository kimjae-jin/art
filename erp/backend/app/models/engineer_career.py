from sqlalchemy import Column, BigInteger, Text, Date, Numeric, TIMESTAMP, func
from app.db import Base

class EngineerCareer(Base):
    __tablename__ = "engineer_careers"
    __table_args__ = {"schema": "erp"}

    id               = Column(BigInteger, primary_key=True, autoincrement=True)
    engineer_id      = Column(BigInteger, nullable=False, index=True)
    company          = Column(Text)
    start_date       = Column(Date)
    end_date         = Column(Date)
    recognition_date = Column(Date)
    project_name     = Column(Text)
    client           = Column(Text)
    work_type        = Column(Text)
    method           = Column(Text)
    job_field        = Column(Text)
    specialty        = Column(Text)
    duty             = Column(Text)
    position         = Column(Text)
    report_type      = Column(Text)
    summary          = Column(Text)
    responsibility   = Column(Text)
    amount           = Column(Numeric(18,0))
    project_id       = Column(Text)
    created_at       = Column(TIMESTAMP(timezone=True), server_default=func.now())
