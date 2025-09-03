from typing import List, Union

from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.schemas.chat_schemas import LLMProvider, LLMModel
from src.models.document_model import Document
from src.services.vectorization_service import VectorizationService
from src.core.config import settings


class RagService:
    def __init__(self, vectorization_service: VectorizationService) -> None:
        self.vectorization_service = vectorization_service

    def get_openai_llm(self, model: LLMModel) -> ChatOpenAI:
        return ChatOpenAI(
            api_key=settings.OPENAI_API_KEY, model=model.value, temperature=0.3
        )

    def get_gemini_llm(self, model: LLMModel) -> ChatGoogleGenerativeAI:
        return ChatGoogleGenerativeAI(
            google_api_key=settings.GOOGLE_API_KEY, model=model.value, temperature=0.3
        )

    def get_llm_model(
        self, provider: LLMProvider, model: LLMModel
    ) -> Union[ChatOpenAI, ChatGoogleGenerativeAI]:
        if provider == LLMProvider.OPENAI:
            return self.get_openai_llm(model)
        elif provider == LLMProvider.GEMINI:
            return self.get_gemini_llm(model)
        else:
            raise ValueError(f"Not supported provider: '{provider}' with model '{model}'")

    def load_docs(self, message: str, document_id: int, k: int = 5):
        return self.vectorization_service.search_similar_documents(
            query=message, document_id=document_id, k=k
        )

    def rag_query(
        self,
        message: str,
        history: List[str],
        document: Document,
        provider: LLMProvider,
        model: LLMModel,
    ):
        system_prompt = """Actúa como un asistente amigable. Tu objetivo principal es ayudar a los usuarios a encontrar respuestas dentro de sus documentos.

        Sigue estas reglas estrictamente:
        1.  **Basa tu respuesta 100% en el contexto.** No inventes información ni utilices conocimiento externo.
        2.  **Si la respuesta no está en el contexto,** déjalo claro amablemente"
        3.  **Sé directo:** Comienza tu respuesta abordando directamente la pregunta del usuario.
        4.  **Ten en cuenta el historial:** Utiliza el historial de la conversación para entender el contexto de preguntas de seguimiento.
        5.  **Mejora la legibilidad:** Usa formato markdown (como **negritas** o listas) para que tus respuestas sean fáciles de leer.

        Metadatos del documento:
        {metadata}

        Contexto relevante del documento:
        {context}
        """

        llm = self.get_llm_model(provider, model)

        docs = self.load_docs(message=message, document_id=document.id, k=10)
        context = "\n".join([doc.page_content for doc in docs])

        metadata = f"Filename: {document.filename}"

        system_prompt_fmt = system_prompt.format(context=context, metadata=metadata)

        messages = [
            SystemMessage(content=system_prompt_fmt),
            *[HumanMessage(content=msg) for msg in history],
            HumanMessage(content="message"),
        ]

        response = llm.invoke(messages)
        return response.content
