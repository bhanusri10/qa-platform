from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DefectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: Optional[str] = "medium"
    test_case_id: Optional[int] = None
    assigned_to: Optional[int] = None

class DefectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None

class DefectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    severity: str
    status: str
    test_case_id: Optional[int]
    reported_by: int
    assigned_to: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True