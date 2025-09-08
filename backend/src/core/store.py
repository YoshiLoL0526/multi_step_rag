from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

from src.core.config import settings


embedding = OpenAIEmbeddings(
    model="text-embedding-3-small", api_key=settings.OPENAI_API_KEY
)

chroma_config = {
    "collection_name": "documents",
    "embedding_function": embedding,
}

if not settings.CHROMA_PERSIST:
    chroma_config.update(
        {
            "host": settings.CHROMA_HOST,
            "port": settings.CHROMA_PORT,
        }
    )
else:
    chroma_config.update({"persist_directory": "chroma_db"})

vector_store = Chroma(**chroma_config)
