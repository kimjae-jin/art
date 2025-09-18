from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date

class License(SQLModel, table=True):
    licenseId: str = Field(primary_key=True, index=True)
    licenseName: str
    licenseNumber: Optional[str] = None
    issuingAuthority: Optional[str] = None
    acquisitionDate: Optional[date] = None
    renewalCycle: Optional[int] = None
    renewalDate: Optional[date] = None
    isPersonnelBased: bool = False
    isEquipmentBased: bool = False
    capitalRequired: bool = False
    remarks: Optional[str] = None