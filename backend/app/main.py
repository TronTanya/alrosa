import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import db as db_module
from app.routers import health as health_router
from app.routers import nylas as nylas_router

# backend/.env, затем корень репозитория (override — ключи из корневого .env приоритетнее)
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_REPO_ROOT = _BACKEND_ROOT.parent
load_dotenv(_BACKEND_ROOT / ".env")
load_dotenv(_REPO_ROOT / ".env", override=True)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db_module.init_db()
    yield
    await db_module.dispose_engine()


app = FastAPI(title="ИИ-Куратор — backend", version="0.1.0", lifespan=lifespan)

_origins = os.getenv("NYLAS_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router.router)
app.include_router(nylas_router.router)
