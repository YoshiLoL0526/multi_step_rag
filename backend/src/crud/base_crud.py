from typing import Generic, TypeVar, Type, Optional, List, cast, Dict, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.models.base_model import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseCRUD(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType], session: Session):
        """Initialize CRUD with SQLAlchemy model."""
        self.model = model
        self.session = session

    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get a record by ID."""
        query = self.session.query(self.model)
        return query.filter(getattr(self.model, "id") == id).first()

    def get_all(
        self, skip: int = 0, limit: int = 100, filters: Dict[str, Any] = {}
    ) -> List[ModelType]:
        """Get all records with pagination."""
        return (
            self.session.query(self.model)
            .filter_by(**filters)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record."""
        obj_data = obj_in.model_dump()
        db_obj = cast(ModelType, self.model())
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, obj_in: UpdateSchemaType) -> ModelType:
        """Update an existing record."""
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update_by_id(self, id: int, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        """Update a record by ID."""
        db_obj = self.session.query(self.model).get(id)
        if db_obj is None:
            return None
        return self.update(db_obj=db_obj, obj_in=obj_in)

    def delete(self, db_obj: ModelType) -> Optional[ModelType]:
        """Delete a record."""
        self.session.delete(db_obj)
        self.session.commit()
        return db_obj

    def delete_by_id(self, id: int) -> Optional[ModelType]:
        """Delete a record by ID."""
        obj = self.session.query(self.model).get(id)
        if obj is None:
            return None
        return self.delete(db_obj=obj)
