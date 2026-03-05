from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.testcase import TestCase
from app.models.user import User
from app.schemas.testcase import TestCaseCreate, TestCaseUpdate, TestCaseResponse
from app.utils import verify_token
from fastapi.security import HTTPBearer
from fastapi import Security

router = APIRouter(
    prefix="/testcases",
    tags=["Test Cases"]
)

security = HTTPBearer()

def get_current_user(credentials=Security(HTTPBearer()), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/", response_model=List[TestCaseResponse])
def get_testcases(project_id: int = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(TestCase)
    if project_id:
        query = query.filter(TestCase.project_id == project_id)
    return query.all()

@router.post("/", response_model=TestCaseResponse)
def create_testcase(testcase: TestCaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_testcase = TestCase(
        title=testcase.title,
        description=testcase.description,
        priority=testcase.priority,
        status=testcase.status,
        project_id=testcase.project_id,
        created_by=current_user.id
    )
    db.add(new_testcase)
    db.commit()
    db.refresh(new_testcase)
    return new_testcase

@router.get("/{testcase_id}", response_model=TestCaseResponse)
def get_testcase(testcase_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    testcase = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not testcase:
        raise HTTPException(status_code=404, detail="Test case not found")
    return testcase

@router.put("/{testcase_id}", response_model=TestCaseResponse)
def update_testcase(testcase_id: int, testcase_data: TestCaseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    testcase = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not testcase:
        raise HTTPException(status_code=404, detail="Test case not found")
    if testcase_data.title:
        testcase.title = testcase_data.title
    if testcase_data.description:
        testcase.description = testcase_data.description
    if testcase_data.priority:
        testcase.priority = testcase_data.priority
    if testcase_data.status:
        testcase.status = testcase_data.status
    db.commit()
    db.refresh(testcase)
    return testcase

@router.delete("/{testcase_id}")
def delete_testcase(testcase_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete test cases")
    testcase = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not testcase:
        raise HTTPException(status_code=404, detail="Test case not found")
    db.delete(testcase)
    db.commit()
    return {"message": "Test case deleted successfully"}