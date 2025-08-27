from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from src.core.config import settings


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields a database session for use in async contexts.
    """
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
    await engine.dispose()
