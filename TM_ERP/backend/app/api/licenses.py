from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db.session import get_session
from ..models.license import License

router = APIRouter(prefix="/licenses", tags=["licenses"])

@router.post("/", response_model=License)
def create_license(license: License, session: Session = Depends(get_session)):
    session.add(license)
    session.commit()
    session.refresh(license)
    return license

@router.get("/", response_model=list[License])
def list_licenses(session: Session = Depends(get_session)):
    return session.exec(select(License)).all()