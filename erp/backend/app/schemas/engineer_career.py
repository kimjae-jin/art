from pydantic import BaseModel, Field
from typing import Optional, List, Literal

Law = Literal["건진법", "엔산법"]

class EngineerCareerIn(BaseModel):
    company: str = Field(default="")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    recognition_date: Optional[str] = None
    project_name: str = Field(default="")
    client: str = Field(default="")
    work_type: str = Field(default="")
    method: str = Field(default="")
    job_field: str = Field(default="")
    specialty: str = Field(default="")
    duty: str = Field(default="")
    position: str = Field(default="")
    report_type: str = Field(default="")
    summary: str = Field(default="")
    responsibility: str = Field(default="")
    amount: Optional[float] = None
    project_id: Optional[str] = None

class EngineerCareerBulkIn(BaseModel):
    law: Law
    items: List[EngineerCareerIn]

class EngineerCareerOut(BaseModel):
    id: int
    engineer_id: int
    company_name: str
    project_name: str
    start_date: Optional[str]
    end_date: Optional[str]
    client: Optional[str]
    amount: Optional[float]
    law: Law
