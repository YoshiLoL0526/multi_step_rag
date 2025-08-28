from typing import Annotated, Generator
from fastapi import Depends, status, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session, sessionmaker
from langchain_chroma import Chroma

from src.core.db import engine
from src.models.user_model import User
from src.crud.user_crud import UserCRUD
from src.crud.document_crud import DocumentCRUD
from src.services.auth_service import AuthService
from src.services.document_service import DocumentService
from src.services.document_processor import DocumentProcessor
from src.core.security import JWTBearer
from src.core.config import settings
from src.core.store import vector_store


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


def get_document_crud(db: Session = Depends(get_db)):
    return DocumentCRUD(db)


DocumentCRUDDep = Annotated[DocumentCRUD, Depends(get_document_crud)]


def pagination_params(
    skip: int = 0,
    limit: int = 100,
):
    return {"skip": skip, "limit": limit}


PaginationParamsDep = Annotated[dict, Depends(pagination_params)]


def get_vector_store() -> Chroma:
    return vector_store


VectorStoreDep = Annotated[Chroma, Depends(get_vector_store)]


def get_document_processor(
    vector_store: VectorStoreDep,
) -> DocumentProcessor:
    return DocumentProcessor(vector_store=vector_store)


DocumentProcessorDep = Annotated[DocumentProcessor, Depends(get_document_processor)]


def get_document_service(
    document_crud: DocumentCRUDDep,
    document_processor: DocumentProcessorDep,
) -> DocumentService:
    return DocumentService(
        document_crud=document_crud, document_processor=document_processor
    )


DocumentServiceDep = Annotated[DocumentService, Depends(get_document_service)]
