from sqlalchemy.orm import Session

from .base_crud import BaseCRUD
from src.models.chat_models import Conversation


class ConversationCRUD(BaseCRUD):
    def __init__(self, session: Session):
        super().__init__(Conversation, session)
