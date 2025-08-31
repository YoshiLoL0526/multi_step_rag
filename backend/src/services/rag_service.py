from typing import Any, List, Dict

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.services.vectorization_service import VectorizationService
from src.core.config import settings


class RagService:
    def __init__(self, vectorization_service: VectorizationService) -> None:
        self.vectorization_service = vectorization_service
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY, model="gpt-4o", temperature=0.3
        )

    def load_docs(self, message: str, document_id: int, k: int = 5):
        return self.vectorization_service.search_similar_documents(
            query=message, document_id=document_id, k=k
        )

    def rag_query(self, message: str, history: List[str], document_id: int):
        system_prompt = """You are an assistant for document analysis tasks.
        Use the following pieces of retrieved context to answer the question.
        If you can't inhere the response let it clear.
        Context: {context}:"""

        docs = self.load_docs(message=message, document_id=document_id, k=5)
        context = "\n".join([doc.page_content for doc in docs])

        system_prompt_fmt = system_prompt.format(context=context)

        messages = [
            SystemMessage(content=system_prompt_fmt),
            *[HumanMessage(content=msg) for msg in history],
            HumanMessage(content="message"),
        ]

        response = self.llm.invoke(messages)
        return response.content
