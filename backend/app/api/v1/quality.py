from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import NCR, CAPA, Certificate, SPCRecord, Audit, ActivityLog
from app.schemas.schemas import NCROut, CAPAOut, CertificateOut

router = APIRouter(prefix="/quality", tags=["Quality & Compliance"])

# NCRs
@router.get("/ncrs", response_model=List[NCROut])
def get_ncrs(site_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(NCR)
    if site_id:
        query = query.filter(NCR.site_id == site_id)
    if status:
        query = query.filter(NCR.status == status)
    return query.order_by(NCR.id.desc()).all()

@router.post("/ncrs", response_model=NCROut)
def create_ncr(
    title: str,
    site_id: int,
    description: str,
    severity: str = "Major",
    containment_action: Optional[str] = None,
    db: Session = Depends(get_db)
):
    ncr_count = db.query(NCR).count() + 101
    ncr_num = f"NCR-2026-{ncr_count:03d}"
    ncr = NCR(
        ncr_number=ncr_num,
        title=title,
        site_id=site_id,
        severity=severity,
        description=description,
        containment_action=containment_action,
        status="Open"
    )
    db.add(ncr)
    db.commit()
    db.refresh(ncr)
    return ncr

# CAPAs
@router.get("/capas", response_model=List[CAPAOut])
def get_capas(db: Session = Depends(get_db)):
    return db.query(CAPA).order_by(CAPA.id.desc()).all()

# Certificates
@router.get("/certificates", response_model=List[CertificateOut])
def get_certificates(db: Session = Depends(get_db)):
    certs = db.query(Certificate).all()
    # Dynamic status update based on expiry date
    return certs

# SPC Analytics
@router.get("/spc")
def get_spc_records(db: Session = Depends(get_db)):
    records = db.query(SPCRecord).order_by(SPCRecord.id.desc()).limit(20).all()
    return [{
        "id": r.id,
        "parameter_name": r.parameter_name,
        "mean_value": r.mean_value,
        "ucl": r.ucl,
        "lcl": r.lcl,
        "usl": r.usl,
        "lsl": r.lsl,
        "cpk": r.cpk,
        "is_out_of_control": r.is_out_of_control,
        "timestamp": r.timestamp
    } for r in records]

# Audits
@router.get("/audits")
def get_audits(db: Session = Depends(get_db)):
    audits = db.query(Audit).all()
    return audits
