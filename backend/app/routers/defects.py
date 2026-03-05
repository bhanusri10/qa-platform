from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.defect import Defect
from app.models.user import User
from app.schemas.defect import DefectCreate, DefectUpdate, DefectResponse
from app.utils import verify_token
from fastapi.security import HTTPBearer
from fastapi import Security

router = APIRouter(
    prefix="/defects",
    tags=["Defects"]
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

@router.get("/", response_model=List[DefectResponse])
def get_defects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Defect).all()

@router.post("/", response_model=DefectResponse)
def create_defect(defect: DefectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_defect = Defect(
        title=defect.title,
        description=defect.description,
        severity=defect.severity,
        test_case_id=defect.test_case_id,
        reported_by=current_user.id,
        assigned_to=defect.assigned_to
    )
    db.add(new_defect)
    db.commit()
    db.refresh(new_defect)
    return new_defect

@router.get("/{defect_id}", response_model=DefectResponse)
def get_defect(defect_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    defect = db.query(Defect).filter(Defect.id == defect_id).first()
    if not defect:
        raise HTTPException(status_code=404, detail="Defect not found")
    return defect

@router.put("/{defect_id}", response_model=DefectResponse)
def update_defect(defect_id: int, defect_data: DefectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    defect = db.query(Defect).filter(Defect.id == defect_id).first()
    if not defect:
        raise HTTPException(status_code=404, detail="Defect not found")
    if defect_data.title:
        defect.title = defect_data.title
    if defect_data.description:
        defect.description = defect_data.description
    if defect_data.severity:
        defect.severity = defect_data.severity
    if defect_data.status:
        defect.status = defect_data.status
    if defect_data.assigned_to:
        defect.assigned_to = defect_data.assigned_to
    db.commit()
    db.refresh(defect)
    return defect

@router.delete("/{defect_id}")
def delete_defect(defect_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete defects")
    defect = db.query(Defect).filter(Defect.id == defect_id).first()
    if not defect:
        raise HTTPException(status_code=404, detail="Defect not found")
    db.delete(defect)
    db.commit()
    return {"message": "Defect deleted successfully"}