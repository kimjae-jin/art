from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv()
class Settings(BaseModel):
    APP_NAME: str = "TM ERP"
    ENV: str = os.getenv("ENV", "dev")
    DATABASE_URL: str | None = os.getenv("DATABASE_URL")
settings = Settings()
