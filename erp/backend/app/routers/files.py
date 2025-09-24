from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from datetime import datetime
from pathlib import Path
import re, os, shutil

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[3] / "files" / "uploads"
BASE_DIR.mkdir(parents=True, exist_ok=True)
MAX_SIZE = 5 * 1024 * 1024

def safe(s:str)->str:
    return re.sub(r"[^0-9A-Za-z가-힣_.-]+","_", s).strip("_") or "file"

@router.post("/files/upload")
async def upload_file(entity:str=Form(...), entity_id:str=Form(...), section:str=Form(...), f:UploadFile=File(...)):
    size = 0
    tmp = BASE_DIR / "tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    tmp_file = tmp / f.filename
    with tmp_file.open("wb") as out:
        while True:
            chunk = await f.read(1024*64)
            if not chunk: break
            size += len(chunk)
            if size > MAX_SIZE:
                out.close()
                tmp_file.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="MAX_5MB")
            out.write(chunk)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = BASE_DIR / safe(entity) / safe(entity_id) / safe(section)
    dest.mkdir(parents=True, exist_ok=True)
    final = dest / f"{ts}__{safe(f.filename)}"
    shutil.move(str(tmp_file), final)
    return JSONResponse({"ok":True, "path":str(final)})

@router.get("/files/list")
def list_files(entity:str, entity_id:str, section:str):
    p = BASE_DIR / safe(entity) / safe(entity_id) / safe(section)
    files = []
    if p.exists():
        for x in sorted(p.iterdir(), reverse=True):
            if x.is_file():
                files.append({"name":x.name, "size":x.stat().st_size, "path":str(x)})
    return {"items":files}

