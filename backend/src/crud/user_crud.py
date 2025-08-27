from typing import Optional
from sqlalchemy.orm import Session
from .base_crud import BaseCRUD
from src.models.user_model import User


class UserCRUD(BaseCRUD):
    def __init__(self, session: Session):
        super().__init__(User, session)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.session.query(self.model).filter(self.model.email == email).first()
