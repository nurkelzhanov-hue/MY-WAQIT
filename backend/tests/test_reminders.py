"""Tests for the reminder logic (pure part) and message texts."""
import sys
import types
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
    import dotenv  # noqa: F401
except ImportError:
    sys.modules["dotenv"] = types.SimpleNamespace(load_dotenv=lambda *a, **k: None)

from app.services.reminders import due_reminders, format_message, occurs_on  # noqa: E402
from datetime import date  # noqa: E402

PROFILES = {1: {"language": "kaa", "timezone": "Asia/Tashkent"}, 2: {"language": "ru", "timezone": "Asia/Tashkent"}}


def task(**kw):
    base = {"id": "t1", "telegram_id": 1, "title": "Ushrasiw", "start_date": "2026-11-13", "start_time": "09:00:00",
            "reminder_minutes": 30, "repeat": "none", "repeat_days": [], "task_done": []}
    base.update(kw)
    return base


def utc(h, m, d=13):  # Tashkent is UTC+5
    return datetime(2026, 11, d, h, m, tzinfo=timezone.utc)


def test_all():
    # 09:00 local task, 30 min before = 08:30 local = 03:30 UTC
    assert due_reminders([task()], PROFILES, set(), utc(3, 29)) == []
    r = due_reminders([task()], PROFILES, set(), utc(3, 30))
    assert len(r) == 1 and r[0]["minutes_left"] == 30 and r[0]["time"] == "09:00"
    assert len(due_reminders([task()], PROFILES, set(), utc(3, 50))) == 1
    assert len(due_reminders([task()], PROFILES, set(), utc(4, 5))) == 1      # within 10 min grace after start
    assert due_reminders([task()], PROFILES, set(), utc(4, 11)) == []         # too late
    assert due_reminders([task()], PROFILES, {("t1", "2026-11-13")}, utc(3, 40)) == []  # already sent
    assert due_reminders([task(task_done=[{"done_date": "2026-11-13"}])], PROFILES, set(), utc(3, 40)) == []
    # a reminder that crosses midnight: task at 00:10 local on the 14th, 30 min before = 23:40 local on the 13th
    t = task(start_date="2026-11-14", start_time="00:10:00")
    assert len(due_reminders([t], PROFILES, set(), utc(18, 45))) == 1        # 23:45 local on the 13th
    # daily repeat fires on a later day
    d = task(repeat="daily", start_date="2026-11-01")
    assert len(due_reminders([d], PROFILES, set(), utc(3, 40, 20))) == 1
    # recurrence rules
    assert occurs_on(task(repeat="weekly"), date(2026, 11, 20)) and not occurs_on(task(repeat="weekly"), date(2026, 11, 21))
    assert occurs_on(task(repeat="weekdays", repeat_days=[4]), date(2026, 11, 20))  # Friday = 4
    assert not occurs_on(task(repeat="monthly"), date(2026, 11, 14)) and occurs_on(task(repeat="monthly"), date(2026, 12, 13))
    # texts: one language each, never mixed
    base = {"title": "X", "time": "09:00", "minutes_left": 30}
    assert "Eskertiw" in format_message({**base, "language": "kaa"}) and "минут" not in format_message({**base, "language": "kaa"})
    assert "Напоминание" in format_message({**base, "language": "ru"}) and "через 30 мин" in format_message({**base, "language": "ru"})
    assert "Eslatma" in format_message({**base, "language": "uz"}) and "30 daqiqadan keyin" in format_message({**base, "language": "uz"})
    assert "Eskertiw" in format_message({**base, "language": "xx"})  # unknown -> default
    print("reminder checks passed")


if __name__ == "__main__":
    test_all()
