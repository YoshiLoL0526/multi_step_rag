from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader


class DocumentProcessor:
    def __init__(self, vector_store: Chroma) -> None:
        self.vector_store = vector_store
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )

    def process_document(self, document: str, metadata: dict) -> None:
        if document.endswith(".pdf"):
            loader = PyPDFLoader(document)
        elif document.endswith(".docx"):
            loader = Docx2txtLoader(document)
        elif document.endswith(".txt"):
            loader = TextLoader(document)
        else:
            raise ValueError("Unsupported file format")

        documents = loader.load()
        docs = self.text_splitter.split_documents(documents)

        self.vector_store.add_documents(docs, metadata=metadata)
