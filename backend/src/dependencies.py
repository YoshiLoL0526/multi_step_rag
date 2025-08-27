from typing import Annotated, AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.db import get_db

DatabaseSession = Annotated[AsyncGenerator[AsyncSession, None], Depends(get_db)]
