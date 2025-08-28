from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

from src.core.config import settings


embedding = OpenAIEmbeddings(
    model="text-embedding-3-small", api_key=settings.OPENAI_API_KEY
)

vector_store = Chroma(
    collection_name="documents",
    embedding_function=embedding,
    persist_directory="./chroma_db",
)
