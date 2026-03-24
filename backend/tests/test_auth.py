import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
import os

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/qa_platform_test")

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_register_user():
    response = client.post("/auth/register", json={
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "testpass123",
        "role": "tester"
    })
    assert response.status_code in [200, 400]

def test_login_user():
    client.post("/auth/register", json={
        "email": "logintest@example.com",
        "username": "logintest",
        "password": "testpass123",
        "role": "tester"
    })
    response = client.post("/auth/login", json={
        "email": "logintest@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    response = client.post("/auth/login", json={
        "email": "logintest@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_metrics_endpoint():
    client.post("/auth/register", json={
        "email": "metricstest@example.com",
        "username": "metricstest",
        "password": "testpass123",
        "role": "admin"
    })
    login = client.post("/auth/login", json={
        "email": "metricstest@example.com",
        "password": "testpass123"
    })
    token = login.json()["access_token"]
    response = client.get("/executions/metrics", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert "total" in response.json()
    assert "pass_rate" in response.json()