from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings


def create_application() -> FastAPI:
    app = FastAPI(title=settings.NAME, version=settings.VERSION)

    # Middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOW_ORIGINS,
        allow_credentials=settings.ALLOW_CREDENTIALS,
        allow_methods=settings.ALLOW_METHODS,
        allow_headers=settings.ALLOW_HEADERS,
    )

    # Include routers
    from src.routers import misc

    app.include_router(misc.router, prefix=settings.PREFIX)

    return app
