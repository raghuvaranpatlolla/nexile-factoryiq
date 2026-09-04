from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Document, AuditLog
from app.schemas.schemas import DocumentCreate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("")
def list_documents(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Document).all()

@router.post("")
def create_document(payload: DocumentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    doc = Document(
        doc_number=payload.doc_number,
        title=payload.title,
        doc_type=payload.doc_type,
        owner=payload.owner,
        status="Approved"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    log = AuditLog(user_email=current_user.email, action="UPLOAD_DOC", entity="Document", entity_id=str(doc.id), details=f"Uploaded doc {doc.doc_number}")
    db.add(log)
    db.commit()

    return doc
