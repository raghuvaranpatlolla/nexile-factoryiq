from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import (
    User, Role, Site, ActivityLog, Notification, Project, Document, PurchaseOrder, NCR, RMA, Product
)
from app.schemas.schemas import UserOut, NotificationOut, AuditLogOut, SearchResult

router = APIRouter(prefix="/admin", tags=["Administration & System"])

@router.get("/users", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    res = []
    for u in users:
        u_dict = UserOut.model_validate(u)
        if u.role:
            u_dict.role_name = u.role.name
        res.append(u_dict)
    return res

@router.put("/users/{user_id}/status")
def toggle_user_status(user_id: int, is_active: bool, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = is_active
    db.commit()
    return {"message": "User status updated", "is_active": user.is_active}

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.id.desc()).limit(limit).all()
    return logs

@router.get("/notifications", response_model=List[NotificationOut])
def get_notifications(user_id: int = Query(1), db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()
    return notifs

@router.put("/notifications/read-all")
def mark_all_notifications_read(user_id: int = Query(1), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == user_id).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.get("/search", response_model=List[SearchResult])
def global_search(query: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    results = []
    
    # 1. Projects
    projects = db.query(Project).filter(Project.name.ilike(f"%{query}%") | Project.project_code.ilike(f"%{query}%")).limit(5).all()
    for p in projects:
        results.append(SearchResult(
            category="Projects",
            id=p.id,
            title=f"{p.project_code} - {p.name}",
            subtitle=f"Status: {p.status} | Health: {p.health}",
            link=f"/projects/{p.id}"
        ))
        
    # 2. Documents
    docs = db.query(Document).filter(Document.title.ilike(f"%{query}%") | Document.doc_number.ilike(f"%{query}%")).limit(5).all()
    for d in docs:
        results.append(SearchResult(
            category="Documents",
            id=d.id,
            title=f"{d.doc_number} - {d.title}",
            subtitle=f"Type: {d.doc_type} | Version: {d.current_version}",
            link="/documents"
        ))
        
    # 3. NCRs
    ncrs = db.query(NCR).filter(NCR.title.ilike(f"%{query}%") | NCR.ncr_number.ilike(f"%{query}%")).limit(5).all()
    for n in ncrs:
        results.append(SearchResult(
            category="Quality NCRs",
            id=n.id,
            title=f"{n.ncr_number} - {n.title}",
            subtitle=f"Severity: {n.severity} | Status: {n.status}",
            link="/quality"
        ))
        
    # 4. Purchase Orders
    pos = db.query(PurchaseOrder).filter(PurchaseOrder.po_number.ilike(f"%{query}%")).limit(5).all()
    for po in pos:
        results.append(SearchResult(
            category="Supply Chain POs",
            id=po.id,
            title=f"{po.po_number}",
            subtitle=f"Status: {po.status} | Amount: ${po.total_amount:,.2f}",
            link="/supply-chain"
        ))
        
    # 5. Products
    prods = db.query(Product).filter(Product.name.ilike(f"%{query}%") | Product.sku.ilike(f"%{query}%")).limit(5).all()
    for pr in prods:
        results.append(SearchResult(
            category="Products",
            id=pr.id,
            title=f"{pr.sku} - {pr.name}",
            subtitle=f"Category: {pr.category} | Rev: {pr.revision}",
            link="/documents"
        ))
        
    return results
