from enum import StrEnum

from pydantic import BaseModel


class LLMProvider(StrEnum):
    OPENAI = "openai"
    GEMINI = "gemini"


class LLMModel(StrEnum):
    # OpenAI models
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    GPT_O1 = "gpt-o1"
    GPT_O3 = "gpt-o3"

    # Gemini models
    GEMINI_2_5_PRO = "gemini-2.5-pro"
    GEMINI_2_5_FLASH = "gemini-2.5-flash"
    GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite"
    GEMINI_1_5_PRO = "gemini-1.5-pro"
    GEMINI_1_5_FLASH = "gemini-1.5-flash"


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
    provider: LLMProvider
    model: LLMModel


class CreateDocumentConversationRequest(ConversationBase):
    document_id: int
