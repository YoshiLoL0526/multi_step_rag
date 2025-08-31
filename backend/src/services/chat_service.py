from fastapi import HTTPException, status

from src.schemas.chat_schemas import Role, ConversationCreate, MessageCreate
from src.models.user_model import User
from src.crud.document_crud import DocumentCRUD
from src.crud.conversation_crud import ConversationCRUD
from src.crud.message_crud import MessageCRUD
from src.services.rag_service import RagService


class ChatService:
    def __init__(
        self,
        document_crud: DocumentCRUD,
        conversation_crud: ConversationCRUD,
        message_crud: MessageCRUD,
        rag_service: RagService,
    ):
        self.document_crud = document_crud
        self.conversation_crud = conversation_crud
        self.message_crud = message_crud
        self.rag_service = rag_service

    def create_conversation(self, user: User, document_id: int, title: str):
        document = self.document_crud.get_by_id(document_id)
        if not document or document.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )
        obj_in = ConversationCreate(
            title=title, owner_id=user.id, document_id=document_id
        )
        conversation = self.conversation_crud.create(obj_in=obj_in)
        return conversation

    def get_conversation(self, user: User, conversation_id: int):
        conversation = self.conversation_crud.get_by_id(conversation_id)
        if not conversation or conversation.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
            )
        return conversation

    def get_document_conversations(
        self, user: User, document_id: int, pagination: dict
    ):
        document = self.document_crud.get_by_id(document_id)
        if not document or document.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )
        conversations = self.conversation_crud.get_all(
            skip=pagination["skip"],
            limit=pagination["limit"],
            filters={"owner_id": user.id, "document_id": document_id},
        )
        return conversations

    def get_conversation_messages(
        self, user: User, conversation_id: int, pagination: dict
    ):
        conversation = self.get_conversation(user, conversation_id)
        messages = self.message_crud.get_all(
            skip=pagination["skip"],
            limit=pagination["limit"],
            filters={"conversation_id": conversation.id},
        )
        return messages

    def delete_conversation(self, user: User, conversation_id: int):
        conversation = self.get_conversation(user, conversation_id)
        conversation = self.conversation_crud.delete(conversation)
        return conversation

    def send_message(self, user: User, conversation_id: int, content: str):
        conversation = self.get_conversation(user, conversation_id)

        obj_in = MessageCreate(
            content=content, conversation_id=conversation.id, role=Role.USER
        )
        message = self.message_crud.create(obj_in=obj_in)

        history = [
            msg.content
            for msg in self.message_crud.get_all(
                limit=10, filters={"role": Role.USER}, order_by="created_at", desc=True
            )
        ]

        response = self.rag_service.rag_query(
            message=message.content,
            history=history,
            document_id=conversation.document.id,
        )

        resp_obj_in = MessageCreate(
            content=response, conversation_id=conversation.id, role=Role.ASSISTANT
        )
        message = self.message_crud.create(obj_in=resp_obj_in)

        return response
