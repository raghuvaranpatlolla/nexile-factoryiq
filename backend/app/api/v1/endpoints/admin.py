from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Role, Site, AuditLog
from app.api.deps import get_current_user, require_roles

router = APIRouter()

@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role.name if u.role else "Viewer",
            "site": u.site.name if u.site else "Corporate HQ",
            "department": u.department or "Operations",
            "is_active": u.is_active,
            "created_at": str(u.created_at)
        })
    return result

@router.get("/roles")
def list_roles(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    roles = db.query(Role).all()
    return [{"id": r.id, "name": r.name, "description": r.description} for r in roles]

@router.get("/audit-logs")
def list_audit_logs(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "user_email": l.user_email,
            "action": l.action,
            "entity": l.entity,
            "entity_id": l.entity_id,
            "details": l.details,
            "timestamp": str(l.timestamp)
        }
        for l in logs
    ]
