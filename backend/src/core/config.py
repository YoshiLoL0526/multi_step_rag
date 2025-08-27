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
            f"postgresql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    # Security settings
    SECRET_KEY: str = Field(...)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"


settings = Config()
