from fastapi import FastAPI

app = FastAPI(
    title="QA Platform API",
    description="AI-Driven QA Management & Analytics Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "QA Platform is running!"}