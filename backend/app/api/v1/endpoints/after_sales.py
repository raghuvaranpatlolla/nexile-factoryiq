from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import RMA, AuditLog
from app.schemas.schemas import RMACreate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/summary")
def get_after_sales_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    rmas = db.query(RMA).all()
    return {
        "kpis": {
            "open_rmas": len([r for r in rmas if r.status != "Closed"]) or 12,
            "warranty_claims_this_month": 24,
            "avg_repair_tat_days": 3.8,
            "first_pass_yield_pct": 98.4
        },
        "rmas": rmas,
        "spare_parts": [
            {"part_number": "SP-MCU-01", "description": "Controller Board Assembly", "qty_available": 140, "price": "$120.00"},
            {"part_number": "SP-PWR-05", "description": "High Temp Power Supply", "qty_available": 85, "price": "$85.00"},
            {"part_number": "SP-SNS-99", "description": "Opto-Isolated Sensor Unit", "qty_available": 310, "price": "$45.00"}
        ],
        "warranty_claims": [
            {"claim_id": "WC-2026-001", "customer": "Tesla Energy", "product": "PowerModule Pro 500kW", "status": "Approved", "cost": "$450"},
            {"claim_id": "WC-2026-002", "customer": "Boeing Defense", "product": "Avionics Gateway Unit", "status": "Under Review", "cost": "$1,200"}
        ]
    }

@router.post("/rmas")
def create_rma(payload: RMACreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    rma = RMA(
        rma_number=payload.rma_number,
        customer_name=payload.customer_name,
        product_name=payload.product_name,
        serial_number=payload.serial_number,
        reason=payload.reason,
        priority=payload.priority,
        status="Under Diagnosis"
    )
    db.add(rma)
    db.commit()
    db.refresh(rma)

    log = AuditLog(user_email=current_user.email, action="CREATE_RMA", entity="RMA", entity_id=str(rma.id), details=f"Logged RMA {rma.rma_number}")
    db.add(log)
    db.commit()

    return rma
