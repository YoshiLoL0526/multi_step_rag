from sqlalchemy.orm import Session

from .base_crud import BaseCRUD
from src.models.chat_models import Message


class MessageCRUD(BaseCRUD):
    def __init__(self, session: Session):
        super().__init__(Message, session)
