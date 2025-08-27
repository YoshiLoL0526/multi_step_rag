from typing import Annotated, Generator
from fastapi import Depends, status, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session, sessionmaker

from src.core.db import engine
from src.models.user_model import User
from src.crud.user_crud import UserCRUD
from src.services.auth_service import AuthService
from src.core.security import JWTBearer
from src.core.config import settings


def get_db() -> Generator[Session, None, None]:
    session = sessionmaker(bind=engine, expire_on_commit=False)
    with session() as session:
        yield session
    engine.dispose()


DatabaseSession = Annotated[Generator[Session, None, None], Depends(get_db)]


def get_user_crud(db: Session = Depends(get_db)) -> UserCRUD:
    return UserCRUD(db)


UserCRUDDep = Annotated[UserCRUD, Depends(get_user_crud)]


def get_auth_service(
    user_crud: UserCRUD = Depends(get_user_crud),
):
    return AuthService(user_crud=user_crud)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
JWTDep = Annotated[HTTPAuthorizationCredentials, Depends(JWTBearer())]


def get_current_user(
    user_crud: UserCRUDDep,
    token: JWTDep,
) -> User:
    try:
        payload = jwt.decode(
            token.credentials, settings.SECRET_KEY, algorithms=settings.ALGORITHM
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not validate credentials",
        )
    current_user = user_crud.get_by_id(payload["sub"])
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User not found."
        )
    return current_user


CurrentUserDep = Annotated[User, Depends(get_current_user)]
