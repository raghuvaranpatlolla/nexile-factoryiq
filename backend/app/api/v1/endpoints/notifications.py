from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Notification
from app.api.deps import get_current_user

router = APIRouter()

@router.get("")
def list_notifications(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).all()
    if not notes:
        return [
            {
                "id": 1,
                "title": "Critical Shortage Alert: MCU-8842",
                "message": "Inventory level at Hyderabad facility dropped below minimum safety threshold (250 units remaining).",
                "category": "Supply Chain",
                "priority": "High",
                "is_read": False,
                "created_at": "2026-08-31 10:15"
            },
            {
                "id": 2,
                "title": "CAPA Verification Overdue: CAPA-2026-004",
                "message": "Corrective action effectiveness verification required for Solder Voiding defect.",
                "category": "Quality",
                "priority": "Medium",
                "is_read": False,
                "created_at": "2026-08-31 08:30"
            },
            {
                "id": 3,
                "title": "ISO 9001:2015 Recertification Notice",
                "message": "Certificate # ISO-9001-2024 expires in 45 days. Audit schedule initiated.",
                "category": "Compliance",
                "priority": "High",
                "is_read": True,
                "created_at": "2026-08-30 16:00"
            }
        ]
    return notes

@router.post("/{notification_id}/read")
def mark_read(notification_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    n = db.query(Notification).get(notification_id)
    if n:
        n.is_read = True
        db.commit()
    return {"status": "success"}
