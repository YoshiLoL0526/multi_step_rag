from typing import Optional
from pydantic import BaseModel
from .base_schemas import TimestampMixin
from src.models.document_model import DocumentStatus


class DocumentBase(BaseModel):
    filename: str


class DocumentCreate(DocumentBase):
    storage_path: str
    owner_id: int
    file_size: int


class DocumentUpdate(BaseModel):
    filename: Optional[str] = None
    status: Optional[DocumentStatus] = None
    storage_path: Optional[str] = None


class DocumentInDB(DocumentBase, TimestampMixin):
    id: int
    status: DocumentStatus
    file_size: int

    class Config:
        from_attributes = True


class DocumentUpdateRequest(BaseModel):
    filename: Optional[str] = None
