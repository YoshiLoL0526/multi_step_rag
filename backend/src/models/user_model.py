from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime
from .base_model import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    documents = relationship("Document", back_populates="owner")
    conversations = relationship("Conversation", back_populates="owner")
