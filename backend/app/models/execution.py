from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"))
    status = Column(String, nullable=False)  # pass, fail, blocked, skipped
    notes = Column(Text)
    executed_by = Column(Integer, ForeignKey("users.id"))
    executed_at = Column(DateTime(timezone=True), server_default=func.now())

    test_case = relationship("TestCase")
    executor = relationship("User")