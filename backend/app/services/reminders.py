"""Reminders: finds tasks whose reminder time has come and sends them through the Telegram bot.

A reminder is sent once per (task, occurrence date): the claim row in `reminder_log` is
inserted first (duplicates are ignored), and only the instance that inserted it sends.
Everything here runs on the standard library only.
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta, timezone, tzinfo
from typing import Any
from zoneinfo import ZoneInfo

from app.core.config import get_settings
from app.db.supabase import DatabaseError, request

log = logging.getLogger("waqit.reminders")
APP_URL = "https://nurkelzhanov-hue.github.io/MY-WAQIT/"
MAX_LOOKAHEAD_DAYS = 7          # reminder_minutes is limited to 7 days in the schema
LATE_GRACE = timedelta(minutes=10)  # still send if the server woke up a bit after the start time
FALLBACK_OFFSETS = {"Asia/Tashkent": 5, "Asia/Samarkand": 5, "Asia/Qyzylorda": 5, "Asia/Almaty": 5}

# One language per message, never mixed.
TEXTS = {
    "kaa": ("🔔 Eskertiw", "{m} minuttan keyin", "Waqıt ámeldiń házir", "Ashıw"),
    "uz": ("🔔 Eslatma", "{m} daqiqadan keyin", "Hozir boshlanadi", "Ochish"),
    "ru": ("🔔 Напоминание", "через {m} мин", "Начинается сейчас", "Открыть"),
}


def get_tz(name: str | None) -> tzinfo:
    name = name or get_settings().default_timezone
    try:
        return ZoneInfo(name)
    except Exception:  # tzdata missing on the host
        return timezone(timedelta(hours=FALLBACK_OFFSETS.get(name, 5)))


def occurs_on(task: dict[str, Any], day: date) -> bool:
    """Same rules as the frontend `occursOn` (weekday: 0 = Monday)."""
    start = date.fromisoformat(task["start_date"])
    if day < start:
        return False
    rep = task["repeat"]
    if rep == "none":
        return day == start
    if rep == "daily":
        return True
    if rep == "weekly":
        return day.weekday() == start.weekday()
    if rep == "monthly":
        return day.day == start.day
    if rep == "yearly":
        return day.day == start.day and day.month == start.month
    if rep == "weekdays":
        return day.weekday() in (task.get("repeat_days") or [])
    return False


def _hm(value: Any) -> tuple[int, int]:
    s = str(value)
    return int(s[0:2]), int(s[3:5])


def due_reminders(
    tasks: list[dict[str, Any]],
    profiles: dict[int, dict[str, Any]],
    logged: set[tuple[str, str]],
    now_utc: datetime,
) -> list[dict[str, Any]]:
    """Pure function: which reminders should be sent right now."""
    out: list[dict[str, Any]] = []
    for task in tasks:
        profile = profiles.get(task["telegram_id"], {})
        tz = get_tz(profile.get("timezone"))
        now_local = now_utc.astimezone(tz)
        done = {d["done_date"] for d in (task.get("task_done") or [])}
        hour, minute = _hm(task["start_time"])
        for offset in range(-1, MAX_LOOKAHEAD_DAYS + 1):
            day = now_local.date() + timedelta(days=offset)
            if not occurs_on(task, day):
                continue
            iso = day.isoformat()
            if iso in done or (task["id"], iso) in logged:
                continue
            start_at = datetime(day.year, day.month, day.day, hour, minute, tzinfo=tz)
            remind_at = start_at - timedelta(minutes=task["reminder_minutes"])
            if remind_at <= now_local <= start_at + LATE_GRACE:
                out.append({
                    "task_id": task["id"], "occurrence": iso, "chat_id": task["telegram_id"],
                    "title": task["title"], "time": f"{hour:02d}:{minute:02d}",
                    "minutes_left": max(0, round((start_at - now_local).total_seconds() / 60)),
                    "language": profile.get("language") or "kaa",
                })
    return out


def format_message(r: dict[str, Any]) -> str:
    head, before, now, _ = TEXTS.get(r["language"], TEXTS["kaa"])
    when = before.format(m=r["minutes_left"]) if r["minutes_left"] > 0 else now
    return f"{head}\n\n{r['title']}\n🕒 {r['time']} · {when}"


def send_telegram(chat_id: int, text: str, button: str) -> bool:
    token = get_settings().bot_token
    if not token:
        return False
    body = {
        "chat_id": chat_id,
        "text": text,
        "reply_markup": {"inline_keyboard": [[{"text": button, "web_app": {"url": APP_URL}}]]},
    }
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=json.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except urllib.error.HTTPError as exc:
        log.warning("telegram sendMessage %s for chat %s", exc.code, chat_id)  # token never logged
    except (urllib.error.URLError, TimeoutError):
        log.warning("telegram sendMessage unreachable for chat %s", chat_id)
    return False


def run_once(now_utc: datetime | None = None) -> int:
    """Check the database and send the reminders that are due. Returns how many were sent."""
    now_utc = now_utc or datetime.now(timezone.utc)
    horizon = (now_utc + timedelta(days=MAX_LOOKAHEAD_DAYS + 1)).date().isoformat()
    earliest = (now_utc - timedelta(days=2)).date().isoformat()
    try:
        tasks = request("GET", "tasks", params={
            "select": "*,task_done(done_date)",
            "start_date": f"lte.{horizon}",
            "or": f"(repeat.neq.none,start_date.gte.{earliest})",
        }) or []
        if not tasks:
            return 0
        profiles = {p["telegram_id"]: p for p in (request("GET", "profiles", params={
            "select": "telegram_id,language,timezone"}) or [])}
        logged = {(r["task_id"], r["occurrence"]) for r in (request("GET", "reminder_log", params={
            "select": "task_id,occurrence", "occurrence": f"gte.{earliest}"}) or [])}
    except DatabaseError:
        return 0
    sent = 0
    for r in due_reminders(tasks, profiles, logged, now_utc):
        try:
            claimed = request("POST", "reminder_log", params={"on_conflict": "task_id,occurrence"},
                              body={"task_id": r["task_id"], "occurrence": r["occurrence"]},
                              prefer="resolution=ignore-duplicates,return=representation")
        except DatabaseError:
            continue
        if not claimed:  # another instance already took it
            continue
        if send_telegram(r["chat_id"], format_message(r), TEXTS.get(r["language"], TEXTS["kaa"])[3]):
            sent += 1
    return sent
