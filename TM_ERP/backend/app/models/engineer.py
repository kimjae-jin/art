from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date

class Engineer(SQLModel, table=True):
    employeeId: str = Field(primary_key=True, index=True)
    employeeName: str
    dateOfBirth: Optional[date] = None
    hireDate: Optional[date] = None
    leaveDate: Optional[date] = None
    status: str = "근무"
    department: Optional[str] = None
    position: Optional[str] = None
    rank: Optional[str] = None
    email: Optional[str] = None
    tel: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    remarks: Optional[str] = None