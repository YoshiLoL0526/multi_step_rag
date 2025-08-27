from fastapi import APIRouter
from src.schemas.user_schemas import UserInDB
from src.schemas.auth_schemas import TokenSchema, UserLoginSchema
from src.dependencies import AuthServiceDep, CurrentUserDep

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenSchema)
async def login(request: UserLoginSchema, auth_service: AuthServiceDep):
    return auth_service.authenticate_user(
        email=request.email, password=request.password
    )


@router.get("/me", response_model=UserInDB)
async def get_current_user(current_user: CurrentUserDep):
    return current_user
