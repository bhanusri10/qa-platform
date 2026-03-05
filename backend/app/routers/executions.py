from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.execution import Execution
from app.models.user import User
from app.schemas.execution import ExecutionCreate, ExecutionResponse, ExecutionMetrics
from app.utils import verify_token
from fastapi.security import HTTPBearer
from fastapi import Security

router = APIRouter(
    prefix="/executions",
    tags=["Executions"]
)

def get_current_user(credentials=Security(HTTPBearer()), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/", response_model=List[ExecutionResponse])
def get_executions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Execution).all()

@router.post("/", response_model=ExecutionResponse)
def create_execution(execution: ExecutionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_execution = Execution(
        test_case_id=execution.test_case_id,
        status=execution.status,
        notes=execution.notes,
        executed_by=current_user.id
    )
    db.add(new_execution)
    db.commit()
    db.refresh(new_execution)
    return new_execution

@router.get("/metrics", response_model=ExecutionMetrics)
def get_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    executions = db.query(Execution).all()
    total = len(executions)
    passed = len([e for e in executions if e.status == "pass"])
    failed = len([e for e in executions if e.status == "fail"])
    blocked = len([e for e in executions if e.status == "blocked"])
    skipped = len([e for e in executions if e.status == "skipped"])
    pass_rate = (passed / total * 100) if total > 0 else 0

    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "blocked": blocked,
        "skipped": skipped,
        "pass_rate": round(pass_rate, 2)
    }

@router.get("/{execution_id}", response_model=ExecutionResponse)
def get_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    execution = db.query(Execution).filter(Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution