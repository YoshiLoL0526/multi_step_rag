from datetime import datetime
from fastapi import HTTPException, status
from src.schemas.auth_schemas import TokenSchema
from src.core.security import create_access_token, verify_password
from src.crud.user_crud import UserCRUD


class AuthService:
    def __init__(self, user_crud: UserCRUD):
        self.user_crud = user_crud

    def authenticate_user(self, email: str, password: str) -> TokenSchema:
        user = self.user_crud.get_by_email(email=email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        token, expiration = create_access_token(subject=user.id)
        return TokenSchema(
            access_token=token,
            token_type="bearer",
            expires_in=datetime.fromisoformat(expiration),
        )
