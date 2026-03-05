from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExecutionCreate(BaseModel):
    test_case_id: int
    status: str  # pass, fail, blocked, skipped
    notes: Optional[str] = None

class ExecutionUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class ExecutionResponse(BaseModel):
    id: int
    test_case_id: int
    status: str
    notes: Optional[str]
    executed_by: int
    executed_at: datetime

    class Config:
        from_attributes = True

class ExecutionMetrics(BaseModel):
    total: int
    passed: int
    failed: int
    blocked: int
    skipped: int
    pass_rate: float