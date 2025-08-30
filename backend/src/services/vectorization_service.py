from typing import Dict, Any, Optional

from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.utils.doc_utils import load_document


class VectorizationService:
    """Servicio que coordina el procesamiento y almacenamiento vectorial"""

    def __init__(self, vector_store: Chroma):
        self.vector_store = vector_store
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, separators=["\n\n", "\n", " ", ""]
        )

    def process_and_store_document(
        self, file_path: str, metadata: Dict[str, Any]
    ) -> None:
        documents = load_document(file_path)
        chunks = self.text_splitter.split_documents(documents)
        for idx, chunk in enumerate(chunks, start=1):
            chunk.metadata = metadata
            chunk.metadata["chunk_idx"] = idx
        self.vector_store.add_documents(chunks)

    def search_similar_documents(
        self, query: str, document_id: Optional[int], k: int = 5
    ):
        filter = {"document_id": document_id} if document_id else None
        return self.vector_store.similarity_search(query, k=k, filter=filter)

    def delete_document_vectors(self, document_id: int) -> None:
        self.vector_store.delete([f"doc_{document_id}"])
