import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.me import router as me_router
from app.api.tasks import router as tasks_router
from app.core.config import get_settings
from app.services.reminders import run_once

settings = get_settings()

log = logging.getLogger("waqit.main")
TICK_SECONDS = 30


async def _reminder_loop() -> None:
    while True:
        try:
            sent = await asyncio.to_thread(run_once)
            if sent:
                log.info("reminders sent: %s", sent)
        except Exception:  # the loop must never die
            log.exception("reminder tick failed")
        await asyncio.sleep(TICK_SECONDS)


@asynccontextmanager
async def lifespan(_: FastAPI):
    task = asyncio.create_task(_reminder_loop())
    yield
    task.cancel()


app = FastAPI(title="MY WAQIT API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(me_router)
app.include_router(tasks_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "MY WAQIT"}
