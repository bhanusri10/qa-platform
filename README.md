# AI-Driven QA Management & Analytics Platform

A production-ready full-stack QA management platform enhanced with AI-driven insights.

## Tech Stack

- **Backend:** Python, FastAPI
- **Database:** PostgreSQL, SQLAlchemy
- **Authentication:** JWT tokens, RBAC
- **Frontend:** React (coming soon)
- **AI:** OpenAI API (coming soon)
- **DevOps:** Docker, GitHub Actions CI

## Features

- User authentication with JWT
- Role-based access control (Admin, Manager, Tester)
- Project & Test Cycle management
- Test Case Repository
- Defect Lifecycle Management
- Execution Tracking & Metrics
- AI Risk Prediction (coming soon)
- AI Test Case Generation (coming soon)

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL 16
- Node.js (for frontend)

### Backend Setup

1. Clone the repository

```
   git clone https://github.com/bhanusri10/qa-platform.git
   cd qa-platform
```

2. Create virtual environment

```
   python -m venv venv
   venv\Scripts\activate
```

3. Install dependencies

```
   pip install -r requirements.txt
```

4. Create `.env` file in root folder

```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/qa_platform
   SECRET_KEY=mysecretkey123456789
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Run the server

```
   cd backend
   uvicorn app.main:app --reload
```

6. Visit API docs at `http://localhost:8000/docs`

## API Endpoints

| Module     | Method         | Endpoint            |
| ---------- | -------------- | ------------------- |
| Auth       | POST           | /auth/register      |
| Auth       | POST           | /auth/login         |
| Projects   | GET/POST       | /projects/          |
| Projects   | GET/PUT/DELETE | /projects/{id}      |
| Test Cases | GET/POST       | /testcases/         |
| Test Cases | GET/PUT/DELETE | /testcases/{id}     |
| Defects    | GET/POST       | /defects/           |
| Defects    | GET/PUT/DELETE | /defects/{id}       |
| Executions | GET/POST       | /executions/        |
| Executions | GET            | /executions/metrics |

## Project Structure

```
qa-platform/
├── backend/
│   └── app/
│       ├── models/       # Database models
│       ├── routers/      # API endpoints
│       ├── schemas/      # Pydantic schemas
│       ├── database.py   # DB connection
│       ├── utils.py      # JWT helpers
│       └── main.py       # App entry point
├── frontend/             # React app (Week 2)
├── .env                  # Environment variables
└── README.md
```

## Author

Built by bhanusri10 as part of AI-Driven QA Capstone Project
