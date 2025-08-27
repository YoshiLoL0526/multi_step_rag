from typing import Optional
from pydantic import BaseModel
from src.models.document_model import DocumentStatus


class DocumentBase(BaseModel):
    filename: str


class DocumentCreate(DocumentBase):
    storage_path: str
    owner_id: int


class DocumentUpdate(BaseModel):
    filename: Optional[str] = None
    status: Optional[DocumentStatus] = None
    storage_path: Optional[str] = None


class DocumentInDB(DocumentBase):
    id: int
    status: DocumentStatus

    class Config:
        from_attributes = True


class DocumentUpdateRequest(BaseModel):
    filename: Optional[str] = None
