from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.testcase import TestCase
from app.models.defect import Defect
from app.models.execution import Execution
from app.utils import verify_token
from fastapi.security import HTTPBearer
from fastapi import Security
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter(
    prefix="/ai",
    tags=["AI Insights"]
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

@router.post("/generate-testcases")
def generate_testcases(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    feature = data.get("feature")
    if not feature:
        raise HTTPException(status_code=400, detail="Feature description is required")

    prompt = f"""You are a QA engineer. Generate 5 detailed test cases for the following feature:

Feature: {feature}

For each test case provide:
- Title
- Description  
- Priority (low/medium/high/critical)

Format as a numbered list."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )

    return {"test_cases": response.choices[0].message.content}

@router.post("/analyze-risk")
def analyze_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    defects = db.query(Defect).all()
    executions = db.query(Execution).all()
    testcases = db.query(TestCase).all()

    total = len(executions)
    failed = len([e for e in executions if e.status == "fail"])
    open_defects = len([d for d in defects if d.status == "open"])
    pass_rate = ((total - failed) / total * 100) if total > 0 else 0

    prompt = f"""You are a QA risk analyst. Based on the following QA metrics, provide a brief risk assessment:

- Total test cases: {len(testcases)}
- Total executions: {total}
- Failed executions: {failed}
- Open defects: {open_defects}
- Pass rate: {round(pass_rate, 2)}%

Provide:
1. Overall risk level (Low/Medium/High/Critical)
2. Key concerns (2-3 points)
3. Recommendations (2-3 points)

Keep it concise and professional."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )

    return {
        "metrics": {
            "total_testcases": len(testcases),
            "total_executions": total,
            "failed_executions": failed,
            "open_defects": open_defects,
            "pass_rate": round(pass_rate, 2)
        },
        "risk_analysis": response.choices[0].message.content
    }

@router.post("/suggest-defect")
def suggest_defect(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    test_case_title = data.get("test_case_title")
    notes = data.get("notes")

    if not test_case_title:
        raise HTTPException(status_code=400, detail="Test case title is required")

    prompt = f"""You are a QA engineer. A test case failed and you need to write a defect report.

Test Case: {test_case_title}
Tester Notes: {notes or 'No additional notes'}

Provide:
- Defect Title (one line, clear and specific)
- Description (2-3 sentences explaining the issue)
- Suggested Severity (low/medium/high/critical)

Format clearly with labels."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )

    return {"suggestion": response.choices[0].message.content}