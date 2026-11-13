"""Tests for the Supabase client (against a local mock server) and the task mapping."""
import json
import sys
import threading
from datetime import date
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
    import dotenv  # noqa: F401
except ImportError:  # only for environments without python-dotenv
    import types
    sys.modules["dotenv"] = types.SimpleNamespace(load_dotenv=lambda *a, **k: None)

from app.db import supabase  # noqa: E402
from app.services.task_mapping import row_to_task, task_to_row  # noqa: E402

SEEN = []


class Handler(BaseHTTPRequestHandler):
    def _go(self):
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n)) if n else None
        SEEN.append((self.command, self.path, {k.lower(): v for k, v in self.headers.items()}, body))
        if "boom" in self.path:
            self.send_response(500); self.end_headers(); self.wfile.write(b'{"message":"x"}'); return
        out = b'[{"id":"1"}]' if self.command == "GET" else b""
        self.send_response(200); self.end_headers(); self.wfile.write(out)

    do_GET = do_POST = do_DELETE = _go

    def log_message(self, *a):
        pass


def test_all():
    srv = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_port}"

    supabase._config = lambda: (base, "sb_secret_test")
    assert supabase.request("GET", "tasks", params={"id": "in.(a,b)", "select": "*,task_done(done_date)"}) == [{"id": "1"}]
    m, path, headers, _ = SEEN[-1]
    assert path.startswith("/rest/v1/tasks?") and "id=in." in path
    assert headers["apikey"] == "sb_secret_test" and "authorization" not in headers

    assert supabase.request("POST", "profiles", params={"on_conflict": "telegram_id"}, body={"a": 1}, prefer="return=minimal") is None
    assert SEEN[-1][3] == {"a": 1} and SEEN[-1][2]["prefer"] == "return=minimal"

    supabase._config = lambda: (base, "eyJlegacy")
    supabase.request("GET", "tasks")
    assert SEEN[-1][2]["authorization"] == "Bearer eyJlegacy"

    try:
        supabase.request("GET", "boom")
    except supabase.DatabaseError:
        pass
    else:
        raise AssertionError("DatabaseError expected on 500")

    supabase._config = lambda: ("", "")
    try:
        supabase.request("GET", "tasks")
    except supabase.DatabaseError:
        pass
    else:
        raise AssertionError("DatabaseError expected when not configured")

    t = SimpleNamespace(title="Doktor", description="", date=date(2026, 11, 14), time="09:30",
                        reminder_minutes=30, repeat="weekdays", repeat_days=[0, 2], category="personal",
                        location="", note="")
    row = task_to_row(42, "11111111-1111-1111-1111-111111111111", t)
    assert row["start_date"] == "2026-11-14" and row["telegram_id"] == 42 and row["repeat_days"] == [0, 2]
    row.update(start_time="09:30:00", task_done=[{"done_date": "2026-11-15"}, {"done_date": "2026-11-14"}])
    task = row_to_task(row)
    assert task["time"] == "09:30" and task["doneDates"] == ["2026-11-14", "2026-11-15"]
    assert task["date"] == "2026-11-14" and task["reminderMinutes"] == 30 and task["repeatDays"] == [0, 2]
    print("db client and mapping checks passed")


if __name__ == "__main__":
    test_all()
