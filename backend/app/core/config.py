"""Settings read from environment variables / backend/.env (never from code)."""
from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()

# Origins allowed to call the API from a browser (origin only: no path).
GITHUB_PAGES_ORIGIN = "https://nurkelzhanov-hue.github.io"


@dataclass(frozen=True)
class Settings:
    bot_token: str
    supabase_url: str
    supabase_key: str
    allowed_origins: list[str]
    default_timezone: str


@lru_cache
def get_settings() -> Settings:
    extra = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").strip().rstrip("/")
    origins = sorted({"http://localhost:5173", GITHUB_PAGES_ORIGIN, extra})
    return Settings(
        bot_token=os.getenv("BOT_TOKEN", "").strip(),
        supabase_url=os.getenv("SUPABASE_URL", "").strip(),
        supabase_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip(),
        allowed_origins=origins,
        default_timezone=os.getenv("DEFAULT_TIMEZONE", "Asia/Tashkent"),
    )
