from fastapi import FastAPI
from app.database import engine, Base
from app.models import User, Project, TestCase, Defect
from app.routers import auth

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QA Platform API",
    description="AI-Driven QA Management & Analytics Platform",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "QA Platform is running!"}