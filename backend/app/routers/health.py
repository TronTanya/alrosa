"""Проверка API и PostgreSQL."""

from __future__ import annotations

from fastapi import APIRouter

from app.db import health_check_db

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "alrosa-backend"}


@router.get("/health/db")
async def health_db() -> dict:
    return await health_check_db()
