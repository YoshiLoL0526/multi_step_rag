from typing import Annotated, Generator
from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.db import get_db

DatabaseSession = Annotated[Generator[Session, None], Depends(get_db)]
