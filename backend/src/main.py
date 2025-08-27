from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings


def create_application() -> FastAPI:
    app = FastAPI(title=settings.name, version=settings.version)

    # Middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allow_origins,
        allow_credentials=settings.allow_credentials,
        allow_methods=settings.allow_methods,
        allow_headers=settings.allow_headers,
    )

    # Include routers
    from src.routers import misc

    app.include_router(misc.router, prefix=settings.prefix)

    return app
