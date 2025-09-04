import shutil

from fastapi import HTTPException, UploadFile, status

from src.core.config import settings
from src.models.user_model import User
from src.models.document_model import Document, DocumentStatus
from src.crud.document_crud import DocumentCRUD
from src.schemas.document_schemas import (
    DocumentCreate,
    DocumentUpdate,
    DocumentUpdateRequest,
)
from src.services.vectorization_service import VectorizationService


class DocumentService:
    def __init__(
        self, document_crud: DocumentCRUD, vectorization_service: VectorizationService
    ) -> None:
        self.document_crud = document_crud
        self.vectorization_service = vectorization_service

    def create_document(self, user: User, file: UploadFile) -> Document:
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded"
            )

        file_path = settings.UPLOAD_DIR / file.filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        doc_create = DocumentCreate(
            filename=file.filename,
            storage_path=str(file_path),
            owner_id=user.id,
            file_size=file.size,
        )
        document = self.document_crud.create(obj_in=doc_create)

        # TODO: This should be in a background task
        self.vectorization_service.process_and_store_document(
            file_path=str(file_path),
            metadata={
                "document_id": document.id,
                "owner_id": user.id,
                "filename": file.filename,
            },
        )

        obj_in = DocumentUpdate(status=DocumentStatus.COMPLETED)
        self.document_crud.update(document, obj_in)

        return document

    def get_document(self, user: User, document_id: int) -> Document:
        document = self.document_crud.get_by_id(document_id)
        if document is None or document.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )
        return document

    def list_documents(self, user: User, pagination: dict) -> list[Document]:
        return self.document_crud.get_all(
            skip=pagination["skip"],
            limit=pagination["limit"],
            filters={"owner_id": user.id},
            order_by="created_at",
            desc=False,
        )

    def delete_document(self, user: User, document_id: int) -> Document:
        document = self.get_document(user=user, document_id=document_id)
        self.vectorization_service.delete_document_vectors(document_id)
        deleted_document = self.document_crud.delete(db_obj=document)
        if deleted_document is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete document",
            )
        return deleted_document

    def update_document(
        self, user: User, document_id: int, update_data: DocumentUpdateRequest
    ) -> Document:
        document = self.get_document(user=user, document_id=document_id)
        updated_document = self.document_crud.update_by_id(
            id=document.id, obj_in=update_data
        )
        if updated_document is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update document",
            )
        return updated_document
