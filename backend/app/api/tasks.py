from __future__ import annotations

import logging
from datetime import date as Date, datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.db.supabase import DatabaseError, request
from app.schemas.tasks import DoneIn, TaskImport, TaskIn
from app.services.task_mapping import row_to_task, task_to_row
from app.telegram_auth import TelegramUser

log = logging.getLogger("waqit.tasks")
router = APIRouter(prefix="/api/tasks", tags=["tasks"])
MAX_IMPORT = 500


def _db_error(exc: DatabaseError) -> HTTPException:
    return HTTPException(status.HTTP_502_BAD_GATEWAY, "Database error")


def _ensure_profile(user: TelegramUser) -> None:
    request(
        "POST",
        "profiles",
        params={"on_conflict": "telegram_id"},
        body={
            "telegram_id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "last_seen_at": datetime.now(timezone.utc).isoformat(),
        },
        prefer="resolution=merge-duplicates,return=minimal",
    )


def _owner_of(task_id: UUID) -> int | None:
    rows = request("GET", "tasks", params={"id": f"eq.{task_id}", "select": "telegram_id"})
    return rows[0]["telegram_id"] if rows else None


def _require_own_task(task_id: UUID, user: TelegramUser) -> None:
    if _owner_of(task_id) != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")


@router.get("")
def list_tasks(user: TelegramUser = Depends(get_current_user)) -> list[dict]:
    try:
        _ensure_profile(user)
        rows = request(
            "GET",
            "tasks",
            params={"telegram_id": f"eq.{user.id}", "select": "*,task_done(done_date)", "order": "created_at"},
        )
    except DatabaseError as exc:
        raise _db_error(exc)
    return [row_to_task(r) for r in rows]


@router.put("/{task_id}")
def upsert_task(task_id: UUID, task: TaskIn, user: TelegramUser = Depends(get_current_user)) -> dict:
    try:
        _ensure_profile(user)
        owner = _owner_of(task_id)
        if owner is not None and owner != user.id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
        row = task_to_row(user.id, str(task_id), task)
        row["updated_at"] = datetime.now(timezone.utc).isoformat()
        request("POST", "tasks", params={"on_conflict": "id"}, body=row, prefer="resolution=merge-duplicates,return=minimal")
    except DatabaseError as exc:
        raise _db_error(exc)
    return {"ok": True}


@router.delete("/{task_id}")
def delete_task(task_id: UUID, user: TelegramUser = Depends(get_current_user)) -> dict:
    try:
        _require_own_task(task_id, user)
        request(
            "DELETE",
            "tasks",
            params={"id": f"eq.{task_id}", "telegram_id": f"eq.{user.id}"},
            prefer="return=minimal",
        )
    except DatabaseError as exc:
        raise _db_error(exc)
    return {"ok": True}


@router.put("/{task_id}/done/{day}")
def set_done(task_id: UUID, day: Date, body: DoneIn, user: TelegramUser = Depends(get_current_user)) -> dict:
    try:
        _require_own_task(task_id, user)
        if body.done:
            request(
                "POST",
                "task_done",
                params={"on_conflict": "task_id,done_date"},
                body={"task_id": str(task_id), "done_date": day.isoformat()},
                prefer="resolution=ignore-duplicates,return=minimal",
            )
        else:
            request(
                "DELETE",
                "task_done",
                params={"task_id": f"eq.{task_id}", "done_date": f"eq.{day.isoformat()}"},
                prefer="return=minimal",
            )
    except DatabaseError as exc:
        raise _db_error(exc)
    return {"ok": True}


@router.post("/import")
def import_tasks(tasks: list[TaskImport], user: TelegramUser = Depends(get_current_user)) -> dict:
    """One-time upload of tasks that so far lived only in the browser."""
    if len(tasks) > MAX_IMPORT:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Too many tasks")
    if not tasks:
        return {"imported": 0}
    try:
        _ensure_profile(user)
        ids = ",".join(str(t.id) for t in tasks)
        taken = request("GET", "tasks", params={"id": f"in.({ids})", "select": "id,telegram_id"}) or []
        foreign = {r["id"] for r in taken if r["telegram_id"] != user.id}
        mine = [t for t in tasks if str(t.id) not in foreign]
        if mine:
            request(
                "POST",
                "tasks",
                params={"on_conflict": "id"},
                body=[task_to_row(user.id, str(t.id), t) for t in mine],
                prefer="resolution=merge-duplicates,return=minimal",
            )
            done_rows = [
                {"task_id": str(t.id), "done_date": d.isoformat()} for t in mine for d in set(t.done_dates)
            ]
            if done_rows:
                request(
                    "POST",
                    "task_done",
                    params={"on_conflict": "task_id,done_date"},
                    body=done_rows,
                    prefer="resolution=ignore-duplicates,return=minimal",
                )
    except DatabaseError as exc:
        raise _db_error(exc)
    return {"imported": len(mine)}
