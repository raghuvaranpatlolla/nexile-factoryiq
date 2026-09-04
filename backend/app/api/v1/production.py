from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import ProductionLine, WorkOrder, Site, Product
from app.schemas.schemas import WorkOrderOut

router = APIRouter(prefix="/production", tags=["Production"])

@router.get("/lines")
def get_production_lines(site_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(ProductionLine)
    if site_id:
        query = query.filter(ProductionLine.site_id == site_id)
    lines = query.all()
    
    result = []
    for l in lines:
        active_wo = db.query(WorkOrder).filter(WorkOrder.production_line_id == l.id, WorkOrder.status == "In Progress").first()
        site = db.query(Site).filter(Site.id == l.site_id).first()
        result.append({
            "id": l.id,
            "code": l.code,
            "name": l.name,
            "site_name": site.name if site else "N/A",
            "capacity_per_shift": l.capacity_per_shift,
            "status": l.status,
            "current_wo": active_wo.wo_number if active_wo else "None",
            "target": active_wo.target_quantity if active_wo else 0,
            "actual": active_wo.produced_quantity if active_wo else 0,
            "yield_percent": active_wo.yield_rate if active_wo else 100.0,
            "rework": active_wo.rework_quantity if active_wo else 0,
            "scrap": active_wo.scrap_quantity if active_wo else 0
        })
    return result

@router.get("/work-orders", response_model=List[WorkOrderOut])
def get_work_orders(site_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(WorkOrder)
    if site_id:
        query = query.filter(WorkOrder.site_id == site_id)
    wos = query.order_by(WorkOrder.id.desc()).all()
    
    result = []
    for w in wos:
        w_dict = WorkOrderOut.model_validate(w)
        if w.product:
            w_dict.product_name = w.product.name
        if w.site:
            w_dict.site_name = w.site.name
        if w.production_line:
            w_dict.line_code = w.production_line.code
        result.append(w_dict)
    return result
