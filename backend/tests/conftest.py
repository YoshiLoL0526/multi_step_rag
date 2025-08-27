from typing import AsyncGenerator
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from src.core.config import settings

# Configuración para pytest-asyncio
pytest_plugins = ("pytest_asyncio",)


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Engine de base de datos para testing"""
    engine = create_async_engine(
        settings.DATABASE_URL, echo=False, pool_pre_ping=True, pool_recycle=3600
    )

    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def test_db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Sesión de base de datos para cada test"""
    async_session = sessionmaker(
        bind=test_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session
        await session.rollback()
