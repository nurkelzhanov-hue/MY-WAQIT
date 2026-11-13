"""Minimal Supabase (PostgREST) client on the standard library only.

Uses the secret/service_role key, which is only ever read from the server environment.
Every query made through it must be filtered by the verified Telegram id.
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from app.core.config import get_settings

log = logging.getLogger("waqit.db")
TIMEOUT_SECONDS = 10


class DatabaseError(Exception):
    pass


def _config() -> tuple[str, str]:
    s = get_settings()
    return s.supabase_url, s.supabase_key


def request(
    method: str,
    table: str,
    params: dict[str, str] | None = None,
    body: Any = None,
    prefer: str | None = None,
) -> Any:
    base, key = _config()
    if not base or not key:
        raise DatabaseError("Supabase is not configured")
    url = f"{base.rstrip('/')}/rest/v1/{table}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    headers = {"apikey": key, "Content-Type": "application/json", "Accept": "application/json"}
    if not key.startswith("sb_"):  # legacy JWT keys also go in the Authorization header
        headers["Authorization"] = f"Bearer {key}"
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read()[:300]
        log.error("supabase %s %s -> %s %r", method, table, exc.code, detail)
        raise DatabaseError(f"database returned {exc.code}") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        log.error("supabase %s %s failed: %s", method, table, exc)
        raise DatabaseError("database is unreachable") from exc
    return json.loads(raw) if raw else None
