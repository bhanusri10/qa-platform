from fastapi import FastAPI
from app.database import engine, Base

# Import all models so they register with Base
from app.models import User, Project, TestCase, Defect

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QA Platform API",
    description="AI-Driven QA Management & Analytics Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "QA Platform is running!"}