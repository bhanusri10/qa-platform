from fastapi import FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import User, Project, TestCase, Defect, Execution, TestCycle
from app.routers import auth, projects, testcases, defects, executions

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QA Platform API",
    description="AI-Driven QA Management & Analytics Platform",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True}
)

# CORS — allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(testcases.router)
app.include_router(defects.router)
app.include_router(executions.router)

@app.get("/")
def root():
    return {"message": "QA Platform is running!"}