from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class TestCaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    status: Optional[str] = "active"
    project_id: int
    tags: Optional[List[str]] = []

class TestCaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None

class TestCaseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    status: str
    project_id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True