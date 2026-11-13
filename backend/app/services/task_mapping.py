"""Pure conversion between API task shape (camelCase, as the frontend uses) and DB rows."""
from __future__ import annotations

from typing import Any


def task_to_row(telegram_id: int, task_id: str, t: Any) -> dict[str, Any]:
    return {
        "id": str(task_id),
        "telegram_id": telegram_id,
        "title": t.title,
        "description": t.description,
        "start_date": t.date.isoformat(),
        "start_time": t.time,
        "reminder_minutes": t.reminder_minutes,
        "repeat": t.repeat,
        "repeat_days": list(t.repeat_days),
        "category": t.category,
        "location": t.location,
        "note": t.note,
    }


def row_to_task(row: dict[str, Any]) -> dict[str, Any]:
    done = sorted(d["done_date"] for d in (row.get("task_done") or []))
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "date": row["start_date"],
        "time": str(row["start_time"])[:5],
        "reminderMinutes": row["reminder_minutes"],
        "repeat": row["repeat"],
        "repeatDays": list(row["repeat_days"] or []),
        "category": row["category"],
        "location": row["location"],
        "note": row["note"],
        "doneDates": done,
    }
