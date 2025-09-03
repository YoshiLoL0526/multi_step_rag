from typing import List

from fastapi import APIRouter, status

from src.schemas.chat_schemas import (
    ConversationInDB,
    CreateDocumentConversationRequest,
    MessageInDB,
    SendMessageRequest,
)
from src.dependencies import CurrentUserDep, ChatServiceDep, PaginationParamsDep

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/conversations/", response_model=ConversationInDB)
def create_conversation(
    request: CreateDocumentConversationRequest,
    user: CurrentUserDep,
    chat_service: ChatServiceDep,
):
    return chat_service.create_conversation(
        user=user, document_id=request.document_id, title=request.title
    )


@router.get("/conversations/", response_model=List[ConversationInDB])
def list_conversations(
    document_id: int,
    pagination: PaginationParamsDep,
    user: CurrentUserDep,
    chat_service: ChatServiceDep,
):
    return chat_service.get_document_conversations(
        user=user, document_id=document_id, pagination=pagination
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationInDB)
def get_conversation(
    conversation_id: int, user: CurrentUserDep, chat_service: ChatServiceDep
):
    return chat_service.get_conversation(user=user, conversation_id=conversation_id)


@router.delete(
    "/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_conversation(
    conversation_id: int, user: CurrentUserDep, chat_service: ChatServiceDep
):
    return chat_service.delete_conversation(user=user, conversation_id=conversation_id)


@router.post("/conversations/{conversation_id}/messages/", response_model=MessageInDB)
def send_message(
    conversation_id: int,
    request: SendMessageRequest,
    user: CurrentUserDep,
    chat_service: ChatServiceDep,
):
    return chat_service.send_message(
        user=user,
        conversation_id=conversation_id,
        content=request.content,
        provider=request.provider,
        model=request.model,
    )


@router.get(
    "/conversations/{conversation_id}/messages/", response_model=List[MessageInDB]
)
def list_messages(
    conversation_id: int,
    pagination: PaginationParamsDep,
    user: CurrentUserDep,
    chat_service: ChatServiceDep,
):
    return chat_service.get_conversation_messages(
        user=user, conversation_id=conversation_id, pagination=pagination
    )
