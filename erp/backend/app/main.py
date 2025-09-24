from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import engineers  # ★ 기술인 라우터

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터
app.include_router(engineers.router)

@app.get("/health")
def health():
    return {"ok": True}