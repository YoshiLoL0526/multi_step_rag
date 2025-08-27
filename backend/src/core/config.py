from pydantic_settings import BaseSettings


class Config(BaseSettings):
    # Application settings
    name: str = "MultiStep RAG"
    version: str = "0.1.0"
    prefix: str = "/api"

    # CORS settings
    allow_origins: list[str] = ["*"]
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]


settings = Config()
