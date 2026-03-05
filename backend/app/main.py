from fastapi import FastAPI
from fastapi.security import HTTPBearer
from app.database import engine, Base
from app.models import User, Project, TestCase, Defect
from app.routers import auth, projects

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QA Platform API",
    description="AI-Driven QA Management & Analytics Platform",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True}
)

security = HTTPBearer()

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/")
def root():
    return {"message": "QA Platform is running!"}