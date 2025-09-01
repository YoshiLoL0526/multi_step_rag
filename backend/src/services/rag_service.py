from typing import List

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.models.document_model import Document
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

    def rag_query(self, message: str, history: List[str], document: Document):
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

        docs = self.load_docs(message=message, document_id=document.id, k=10)
        context = "\n".join([doc.page_content for doc in docs])

        metadata = f"Filename: {document.filename}"

        system_prompt_fmt = system_prompt.format(context=context, metadata=metadata)

        messages = [
            SystemMessage(content=system_prompt_fmt),
            *[HumanMessage(content=msg) for msg in history],
            HumanMessage(content="message"),
        ]

        response = self.llm.invoke(messages)
        return response.content
