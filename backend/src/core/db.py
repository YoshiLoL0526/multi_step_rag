from sqlalchemy import create_engine
from src.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)


def create_tables():
    from src.models.base_model import Base

    Base.metadata.create_all(engine)
