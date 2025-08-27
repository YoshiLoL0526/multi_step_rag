from sqlalchemy.orm import Session
from .base_crud import BaseCRUD
from src.models.document_model import Document


class DocumentCRUD(BaseCRUD):
    def __init__(self, session: Session):
        super().__init__(Document, session)
