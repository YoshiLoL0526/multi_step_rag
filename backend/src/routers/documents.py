from fastapi import APIRouter, File, status, UploadFile

from src.schemas.document_schemas import DocumentInDB, DocumentUpdateRequest
from src.dependencies import CurrentUserDep, DocumentServiceDep, PaginationParamsDep

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/upload", status_code=status.HTTP_201_CREATED, response_model=DocumentInDB
)
async def upload_document(
    user: CurrentUserDep,
    document_service: DocumentServiceDep,
    file: UploadFile = File(...),
):
    return document_service.create_document(user=user, file=file)


@router.get("/", response_model=list[DocumentInDB])
async def list_documents(
    user: CurrentUserDep,
    document_service: DocumentServiceDep,
    pagination: PaginationParamsDep,
):
    return document_service.list_documents(user=user, pagination=pagination)


@router.get("/{document_id}", response_model=DocumentInDB)
async def get_document(
    user: CurrentUserDep,
    document_service: DocumentServiceDep,
    document_id: int,
):
    return document_service.get_document(user=user, document_id=document_id)


@router.delete("/{document_id}", response_model=DocumentInDB)
async def delete_document(
    user: CurrentUserDep,
    document_service: DocumentServiceDep,
    document_id: int,
):
    return document_service.delete_document(user=user, document_id=document_id)


@router.put("/{document_id}", response_model=DocumentInDB)
async def update_document(
    user: CurrentUserDep,
    document_service: DocumentServiceDep,
    document_id: int,
    request: DocumentUpdateRequest,
):
    return document_service.update_document(
        user=user, document_id=document_id, update_data=request
    )
