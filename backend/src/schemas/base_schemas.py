from datetime import datetime
from pydantic import field_serializer
from typing import Optional
from src.core.config import settings


class TimestampMixin:
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, dt: datetime) -> str:
        if dt is None:
            return None
        return dt.strftime(settings.DATETIME_FORMAT)
