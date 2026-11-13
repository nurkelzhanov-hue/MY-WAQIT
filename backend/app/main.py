from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.me import router as me_router
from app.api.tasks import router as tasks_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title="MY WAQIT API", version="0.1.0")

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
