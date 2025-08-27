from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.core.config import settings


def get_db() -> Generator[Session, None]:
    """
    Yields a database session for use in async contexts.
    """
    engine = create_engine(settings.DATABASE_URL, echo=True)
    session = sessionmaker(bind=engine, expire_on_commit=False)
    with session() as session:
        yield session
    engine.dispose()
