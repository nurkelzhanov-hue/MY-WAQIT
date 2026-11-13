from __future__ import annotations

from datetime import date as Date
from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

Repeat = Literal["none", "daily", "weekly", "monthly", "yearly", "weekdays"]
Category = Literal["personal", "work", "study", "sport", "other"]


class TaskIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    date: Date
    time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    reminder_minutes: int = Field(default=30, ge=0, le=10080, alias="reminderMinutes")
    repeat: Repeat = "none"
    repeat_days: list[Annotated[int, Field(ge=0, le=6)]] = Field(
        default_factory=list, max_length=7, alias="repeatDays"
    )
    category: Category = "personal"
    location: str = Field(default="", max_length=200)
    note: str = Field(default="", max_length=2000)


class TaskImport(TaskIn):
    id: UUID
    done_dates: list[Date] = Field(default_factory=list, max_length=2000, alias="doneDates")


class DoneIn(BaseModel):
    done: bool
