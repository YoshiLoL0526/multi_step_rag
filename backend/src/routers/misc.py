from fastapi import APIRouter


router = APIRouter(prefix="/misc", tags=["misc"])


@router.get("/health", summary="Health Check")
async def health_check():
    return {"status": "ok"}
