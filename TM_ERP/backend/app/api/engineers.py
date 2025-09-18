from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db.session import get_session
from ..models.engineer import Engineer

router = APIRouter(prefix="/engineers", tags=["engineers"])

@router.post("/", response_model=Engineer)
def create_engineer(engineer: Engineer, session: Session = Depends(get_session)):
    session.add(engineer)
    session.commit()
    session.refresh(engineer)
    return engineer

@router.get("/", response_model=list[Engineer])
def list_engineers(session: Session = Depends(get_session)):
    return session.exec(select(Engineer)).all()