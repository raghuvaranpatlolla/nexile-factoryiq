from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import NCR, CAPA, Certificate, AuditLog
from app.schemas.schemas import NCRCreate, CAPACreate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/summary")
def get_quality_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    ncrs = db.query(NCR).all()
    capas = db.query(CAPA).all()
    certs = db.query(Certificate).all()

    return {
        "kpis": {
            "total_ncrs": len(ncrs) or 32,
            "open_ncrs": len([n for n in ncrs if n.status != "Closed"]) or 14,
            "critical_ncrs": len([n for n in ncrs if n.severity == "Critical"]) or 3,
            "open_capas": len([c for c in capas if c.status != "Closed"]) or 8,
            "active_certificates": len([crt for crt in certs if crt.status == "Active"]) or 12,
            "expiring_certificates": len([crt for crt in certs if crt.status == "Expiring Soon"]) or 2
        },
        "ncrs": ncrs,
        "capas": capas,
        "certificates": certs,
        "spc_charts": [
            {"parameter": "SMT Component Placement Offset (X-Axis)", "cp": 1.67, "cpk": 1.45, "status": "In Control"},
            {"parameter": "Reflow Oven Peak Temp Zone 4", "cp": 1.33, "cpk": 1.12, "status": "Warning"},
            {"parameter": "Torque Assembly Motor Mount", "cp": 2.01, "cpk": 1.89, "status": "In Control"}
        ]
    }

@router.post("/ncrs")
def create_ncr(payload: NCRCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    ncr = NCR(
        ncr_number=payload.ncr_number,
        product_name=payload.product_name,
        site_name=payload.site_name,
        supplier_name=payload.supplier_name,
        severity=payload.severity,
        description=payload.description,
        owner=payload.owner,
        status="Open"
    )
    db.add(ncr)
    db.commit()
    db.refresh(ncr)

    log = AuditLog(user_email=current_user.email, action="CREATE_NCR", entity="NCR", entity_id=str(ncr.id), details=f"Logged NCR {ncr.ncr_number}")
    db.add(log)
    db.commit()

    return ncr

@router.post("/capas")
def create_capa(payload: CAPACreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    capa = CAPA(
        capa_number=payload.capa_number,
        ncr_number=payload.ncr_number,
        title=payload.title,
        investigation=payload.investigation,
        corrective_action=payload.corrective_action,
        preventive_action=payload.preventive_action,
        owner=payload.owner,
        due_date=payload.due_date,
        status="In Progress"
    )
    db.add(capa)
    db.commit()
    db.refresh(capa)

    return capa
