from enum import StrEnum

from pydantic import BaseModel


class ConversationBase(BaseModel):
    title: str


class ConversationCreate(ConversationBase):
    owner_id: int
    document_id: int


class ConversationInDB(ConversationBase):
    id: int
    owner_id: int
    document_id: int

    class Config:
        from_attributes = True


class Role(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    conversation_id: int
    role: Role


class MessageInDB(MessageBase):
    id: int
    conversation_id: int
    role: Role

    class Config:
        from_attributes = True


class SendMessageRequest(MessageBase):
    pass


class CreateDocumentConversationRequest(ConversationBase):
    document_id: int
