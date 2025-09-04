from enum import StrEnum
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Enum as SQLAlchemyEnum,
    DateTime,
)
from sqlalchemy.orm import relationship
from .base_model import Base


class DocumentStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, index=True, nullable=False)
    status = Column(SQLAlchemyEnum(DocumentStatus), default=DocumentStatus.PENDING)
    storage_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="documents")
    conversations = relationship("Conversation", back_populates="document")
