"""
Nylas v3 Hosted OAuth (Outlook / Microsoft). Callback на фронте: /employee/calendar?code=...
Обмен code → grant_id через POST /nylas/exchange.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, List, Optional
from urllib.parse import urlparse, urlunparse

from fastapi import APIRouter, HTTPException, Query
from nylas import Client
from nylas.models.auth import CodeExchangeRequest, URLForAuthenticationConfig
from nylas.models.events import ListEventQueryParams
from pydantic import BaseModel, Field

router = APIRouter(prefix="/nylas", tags=["nylas"])

# Кэш application_id (он же OAuth client_id) из GET /v3/applications
_client_id_cache: Optional[str] = None

# Microsoft Graph — полные scope URI (см. Nylas docs → Calendar/Events для Microsoft)
_MS = "https://graph.microsoft.com/"
_DEFAULT_SCOPES = [
    f"{_MS}Calendars.Read",
    f"{_MS}Calendars.ReadWrite",
]


def _normalize_redirect_uri(uri: str) -> str:
    """Убирает лишние слэши в path; Callback в Nylas должен совпадать с этим значением байт-в-байт."""
    u = uri.strip()
    p = urlparse(u)
    if p.scheme not in ("http", "https") or not p.netloc:
        raise HTTPException(
            status_code=400,
            detail="redirect_uri должен быть полным URL, например http://localhost:5173/employee/calendar",
        )
    path = (p.path or "/").rstrip("/") or "/"
    return urlunparse((p.scheme, p.netloc.lower(), path, "", "", ""))


def _client() -> Client:
    api_key = os.getenv("NYLAS_API_KEY", "").strip()
    api_uri = os.getenv("NYLAS_API_URI", "https://api.us.nylas.com").strip()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Нет NYLAS_API_KEY: добавьте в .env в корне проекта или в backend/.env "
                "(Nylas Dashboard → API Keys), перезапустите бэкенд."
            ),
        )
    return Client(api_key=api_key, api_uri=api_uri)


def _resolve_client_id(nylas: Client) -> str:
    """
    В Hosted OAuth client_id = Application ID в Nylas.
    Можно задать NYLAS_CLIENT_ID вручную или получить автоматически через GET /v3/applications (только API key).
    """
    global _client_id_cache
    env = os.getenv("NYLAS_CLIENT_ID", "").strip()
    if env:
        return env
    if _client_id_cache:
        return _client_id_cache
    try:
        resp = nylas.applications.info()
        _client_id_cache = resp.data.application_id
        return _client_id_cache
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=(
                "Не удалось получить application_id по API key: задайте NYLAS_CLIENT_ID в .env "
                "или проверьте NYLAS_API_KEY и NYLAS_API_URI (для EU: https://api.eu.nylas.com). "
                f"Детали: {e}"
            ),
        ) from e


def _scopes() -> Optional[List[str]]:
    """
    Список scope для Hosted OAuth.
    NYLAS_SCOPES пустой → дефолтные Graph scope для календаря.
    NYLAS_SCOPES=none → не передаём scope (провайдер/Nylas по умолчанию).
    """
    raw = os.getenv("NYLAS_SCOPES", "").strip()
    if raw.lower() in ("none", "-", "default"):
        return None
    if not raw:
        return _DEFAULT_SCOPES
    return [s.strip() for s in raw.split(",") if s.strip()]


class ExchangeBody(BaseModel):
    code: str = Field(..., min_length=1)
    redirect_uri: str = Field(..., min_length=1)


def _response_grant(out: Any) -> dict:
    if isinstance(out, dict):
        return {
            "grant_id": out["grant_id"],
            "email": out.get("email"),
            "provider": out.get("provider"),
        }
    gid = getattr(out, "grant_id", None)
    if gid is None and hasattr(out, "get"):
        gid = out.get("grant_id")
    return {
        "grant_id": gid,
        "email": getattr(out, "email", None),
        "provider": getattr(out, "provider", None),
    }


def _event_to_dict(obj: Any) -> dict:
    if isinstance(obj, dict):
        return obj
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "dict"):
        return obj.dict()
    return {"repr": repr(obj)}


@router.get("/auth/url")
async def get_auth_url(
    redirect_uri: str = Query(
        ...,
        description="Должен совпадать с Callback URI в Nylas (например http://localhost:5173/employee/calendar)",
    ),
):
    nylas = _client()
    rid = _normalize_redirect_uri(redirect_uri)
    cfg: dict = {
        "client_id": _resolve_client_id(nylas),
        "redirect_uri": rid,
        "provider": "microsoft",
        "access_type": "online",
    }
    scopes = _scopes()
    if scopes:
        cfg["scope"] = scopes
    config = URLForAuthenticationConfig(cfg)
    try:
        auth_url = nylas.auth.url_for_oauth2(config)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    return {"url": auth_url}


@router.post("/exchange")
async def exchange_code(body: ExchangeBody):
    nylas = _client()
    rid = _normalize_redirect_uri(body.redirect_uri)
    req = CodeExchangeRequest(
        {
            "redirect_uri": rid,
            "code": body.code,
            "client_id": _resolve_client_id(nylas),
        }
    )
    try:
        out = nylas.auth.exchange_code_for_token(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return _response_grant(out)


@router.get("/events")
async def list_events(
    grant_id: str = Query(...),
    start: str = Query(..., description="ISO 8601"),
    end: str = Query(..., description="ISO 8601"),
    calendar_id: str = Query("primary"),
):
    nylas = _client()

    def _parse_iso(s: str) -> datetime:
        s = s.strip()
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        return datetime.fromisoformat(s)

    try:
        t0 = _parse_iso(start)
        t1 = _parse_iso(end)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Неверный формат даты: {e}") from e

    if t0.tzinfo is None:
        t0 = t0.replace(tzinfo=timezone.utc)
    if t1.tzinfo is None:
        t1 = t1.replace(tzinfo=timezone.utc)

    qp = ListEventQueryParams(
        {
            "calendar_id": calendar_id,
            "start": int(t0.timestamp()),
            "end": int(t1.timestamp()),
        }
    )
    try:
        resp = nylas.events.list(identifier=grant_id, query_params=qp)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    data = [_event_to_dict(e) for e in resp.data]
    return {"data": data, "next_cursor": resp.next_cursor}
