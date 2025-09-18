from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from .db.session import engine
from .api import engineers, licenses
from .core.config import settings

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)

app.include_router(engineers.router)
app.include_router(licenses.router)

@app.get("/health")
def health():
    return {"status": "ok"}
