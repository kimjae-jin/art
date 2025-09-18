from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date

class Equipment(SQLModel, table=True):
    equipmentId: str = Field(primary_key=True, index=True)
    licenseId: Optional[str] = None
    equipmentName: str
    modelNumber: Optional[str] = None
    calibrationDate: Optional[date] = None
    nextCalibrationDate: Optional[date] = None
    calibrationCycle: Optional[int] = None
    location: Optional[str] = None
    notes: Optional[str] = None