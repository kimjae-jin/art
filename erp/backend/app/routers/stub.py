from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import Response
from typing import List, Dict, Any

router = APIRouter()

# favicon 404 제거
@router.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

# 기술경력(협회용) 조회 스텁: 빈 목록
@router.get("/engineers/{engineer_id}/techcareer")
def get_techcareer(engineer_id: int, law: str = "건설진흥법") -> Dict[str, Any]:
    return {"items": []}

# 증빙 업로드 스텁: 항상 ok
@router.post("/evidence/upload")
async def evidence_upload(
    entity: str = Form(...),
    entityId: str = Form(...),
    section: str = Form(...),
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    # 파일은 실제 저장하지 않음 (스텁)
    return {"ok": True}
