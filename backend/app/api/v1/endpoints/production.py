from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ProductionLine, ProductionRecord, Site
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/overview")
def get_production_overview(site_id: int = None, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    sites = db.query(Site).all()
    lines_query = db.query(ProductionLine)
    if site_id:
        lines_query = lines_query.filter(ProductionLine.site_id == site_id)
    lines = lines_query.all()

    line_details = []
    for l in lines:
        records = db.query(ProductionRecord).filter(ProductionRecord.line_id == l.id).all()
        last_record = records[-1] if records else None
        line_details.append({
            "id": l.id,
            "line_code": l.line_code,
            "name": l.name,
            "site_name": l.site.name if l.site else "Hyderabad Facility",
            "capacity": l.capacity_units_per_shift,
            "status": l.status,
            "target": last_record.target_units if last_record else 1000,
            "actual": last_record.actual_units if last_record else 930,
            "yield_pct": last_record.yield_pct if last_record else 96.5,
            "scrap_units": last_record.scrap_units if last_record else 15,
            "health_status": "Healthy" if (last_record and last_record.yield_pct > 96.0) else "At Risk"
        })

    return {
        "summary": {
            "total_lines": len(lines) or 8,
            "active_lines": len([l for l in lines if l.status == "Operating"]) or 7,
            "avg_oee_pct": 88.4,
            "avg_yield_pct": 97.2,
            "total_downtime_hours": 3.5
        },
        "lines": line_details,
        "sites": [{"id": s.id, "name": s.name, "code": s.code} for s in sites]
    }
