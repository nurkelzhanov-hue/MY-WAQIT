from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.telegram_auth import TelegramUser

router = APIRouter(prefix="/api", tags=["me"])


@router.get("/me")
def me(user: TelegramUser = Depends(get_current_user)) -> dict:
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "language_code": user.language_code,
    }
