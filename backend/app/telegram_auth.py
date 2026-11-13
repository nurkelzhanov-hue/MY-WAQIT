"""Verification of Telegram Mini App `initData` (server side).

The frontend sends `Telegram.WebApp.initData`. Only the server, which knows the bot
token, can check its signature. Never trust a user id that was not verified here.
Docs: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
"""
from __future__ import annotations

import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from urllib.parse import parse_qsl

DEFAULT_MAX_AGE_SECONDS = 24 * 60 * 60


class InitDataError(Exception):
    """initData is missing, malformed, forged or too old."""


@dataclass(frozen=True)
class TelegramUser:
    id: int
    first_name: str
    last_name: str | None
    username: str | None
    language_code: str | None


def verify_init_data(
    init_data: str,
    bot_token: str,
    max_age_seconds: int = DEFAULT_MAX_AGE_SECONDS,
    now: float | None = None,
) -> TelegramUser:
    if not init_data or not bot_token:
        raise InitDataError("empty initData or bot token")

    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = pairs.pop("hash", None)
    if not received_hash:
        raise InitDataError("hash is missing")

    data_check_string = "\n".join(f"{k}={pairs[k]}" for k in sorted(pairs))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    expected = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received_hash):
        raise InitDataError("signature mismatch")

    try:
        auth_date = int(pairs["auth_date"])
    except (KeyError, ValueError) as exc:
        raise InitDataError("auth_date is missing or invalid") from exc
    current = time.time() if now is None else now
    if current - auth_date > max_age_seconds:
        raise InitDataError("initData is too old")
    if auth_date - current > 300:
        raise InitDataError("auth_date is in the future")

    try:
        user = json.loads(pairs["user"])
        return TelegramUser(
            id=int(user["id"]),
            first_name=str(user.get("first_name", "")),
            last_name=user.get("last_name"),
            username=user.get("username"),
            language_code=user.get("language_code"),
        )
    except (KeyError, ValueError, TypeError) as exc:
        raise InitDataError("user is missing or invalid") from exc
