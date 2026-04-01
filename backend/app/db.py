"""
Подключение к PostgreSQL (async SQLAlchemy + asyncpg).
Переменная окружения DATABASE_URL — после load_dotenv в main.py.
"""

from __future__ import annotations

import os
from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

_engine: AsyncEngine | None = None
_session_maker: async_sessionmaker[AsyncSession] | None = None


def _normalize_async_url(url: str) -> str:
    u = url.strip()
    if u.startswith("postgresql+asyncpg://"):
        return u
    if u.startswith("postgresql://"):
        return "postgresql+asyncpg://" + u[len("postgresql://") :]
    if u.startswith("postgres://"):
        return "postgresql+asyncpg://" + u[len("postgres://") :]
    return u


def init_db() -> None:
    """Создаёт engine и фабрику сессий, если задан DATABASE_URL."""
    global _engine, _session_maker
    if _engine is not None:
        return
    raw = os.getenv("DATABASE_URL", "").strip()
    if not raw:
        return
    async_url = _normalize_async_url(raw)
    _engine = create_async_engine(async_url, pool_pre_ping=True)
    _session_maker = async_sessionmaker(_engine, class_=AsyncSession, expire_on_commit=False)


async def dispose_engine() -> None:
    global _engine, _session_maker
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _session_maker = None


def is_db_configured() -> bool:
    return bool(os.getenv("DATABASE_URL", "").strip())


async def health_check_db() -> dict:
    """Проверка соединения без обязательной сессии приложения."""
    init_db()
    if _engine is None:
        return {"connected": False, "detail": "DATABASE_URL не задан"}
    try:
        async with _engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"connected": True, "detail": "ok"}
    except Exception as e:  # noqa: BLE001 — отдаём текст в health
        return {"connected": False, "detail": str(e)}


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Зависимость FastAPI для маршрутов с БД."""
    init_db()
    if _session_maker is None:
        raise RuntimeError("База не настроена: укажите DATABASE_URL")
    async with _session_maker() as session:
        yield session
