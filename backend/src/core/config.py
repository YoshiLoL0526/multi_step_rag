import os
from pathlib import Path
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    model_config = {
        "env_file": ".env",
        "env_nested_delimiter": ",",
        "env_file_encoding": "utf-8",
    }

    # Application settings
    ABS_PATH: Path = Path(os.path.join(os.path.dirname(__file__), "..", ".."))
    NAME: str = "MultiStep RAG"
    VERSION: str = "0.1.0"
    PREFIX: str = "/api"

    # CORS settings
    ALLOW_ORIGINS: list[str] = ["*"]
    ALLOW_CREDENTIALS: bool = True
    ALLOW_METHODS: list[str] = ["*"]
    ALLOW_HEADERS: list[str] = ["*"]

    # Database settings
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "postgres"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "multistep_rag"

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    # Security settings
    SECRET_KEY: str = Field(...)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"

    # Upload settings
    UPLOAD_DIR: Path = Path("uploads")
    UPLOAD_DIR.mkdir(exist_ok=True)
    ALLOWED_FILE_TYPES: list[str] = [".pdf", ".docx", ".txt", ".mp3", ".wav", ".m4a"]
    MAX_FILE_SIZE_MB: int = 5 * 1024 * 1024 * 1024  # 5 GB

    # AI settings
    OPENAI_API_KEY: str = Field(...)
    GOOGLE_API_KEY: str = Field(...)

    # ChromaDB
    CHROMA_PERSIST: bool = True
    CHROMA_HOST: str = "http://localhost"
    CHROMA_PORT: int = 8001


settings = Config()
