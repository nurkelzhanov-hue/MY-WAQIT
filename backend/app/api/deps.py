from __future__ import annotations

from fastapi import Header, HTTPException, status

from app.core.config import get_settings
from app.telegram_auth import InitDataError, TelegramUser, verify_init_data


def get_current_user(authorization: str | None = Header(default=None)) -> TelegramUser:
    """Authenticate a request by the Telegram initData sent as `Authorization: tma <initData>`."""
    token = get_settings().bot_token
    if not token:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Server is not configured")
    if not authorization or not authorization.lower().startswith("tma "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Telegram authorization required")
    try:
        return verify_init_data(authorization[4:].strip(), token)
    except InitDataError:
        # The reason is deliberately not returned to the client.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Telegram authorization")
