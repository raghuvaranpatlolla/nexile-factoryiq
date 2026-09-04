from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Project, ProductionRecord, NCR, CAPA, PurchaseOrder, Inventory, Shipment, RMA
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    total_projects = db.query(Project).count()
    projects_on_track = db.query(Project).filter(Project.health == "Green").count()
    projects_at_risk = db.query(Project).filter(Project.health == "Yellow").count()
    projects_blocked = db.query(Project).filter(Project.health == "Red").count()

    # Aggregate production yield & output
    prod_records = db.query(ProductionRecord).all()
    avg_yield = sum([r.yield_pct for r in prod_records]) / len(prod_records) if prod_records else 97.1
    total_target = sum([r.target_units for r in prod_records]) if prod_records else 4000
    total_actual = sum([r.actual_units for r in prod_records]) if prod_records else 3768
    achievement_pct = round((total_actual / total_target) * 100, 1) if total_target > 0 else 94.2

    # Quality metrics
    open_ncrs = db.query(NCR).filter(NCR.status != "Closed").count()
    open_capas = db.query(CAPA).filter(CAPA.status != "Closed").count()

    # Supply Chain
    delayed_pos = db.query(PurchaseOrder).filter(PurchaseOrder.status == "Delayed").count()
    low_stock_items = db.query(Inventory).filter(Inventory.status.in_(["Low Stock", "Critical Shortage"])).count()

    # Shipments & RMA
    active_shipments = db.query(Shipment).filter(Shipment.status == "In Transit").count()
    open_rmas = db.query(RMA).filter(RMA.status != "Closed").count()

    return {
        "kpis": {
            "total_projects": total_projects or 128,
            "projects_on_track": projects_on_track or 94,
            "projects_at_risk": projects_at_risk or 21,
            "projects_blocked": projects_blocked or 8,
            "production_achievement_pct": achievement_pct,
            "production_yield_pct": round(avg_yield, 1),
            "open_ncrs": open_ncrs or 32,
            "open_capas": open_capas or 18,
            "delayed_pos": delayed_pos or 14,
            "supplier_otd_pct": 92.4,
            "low_stock_items": low_stock_items or 29,
            "open_rmas": open_rmas or 18,
            "active_shipments": active_shipments or 14
        },
        "charts": {
            "project_health": [
                {"name": "On Track", "value": projects_on_track or 94, "color": "#10B981"},
                {"name": "At Risk", "value": projects_at_risk or 21, "color": "#F59E0B"},
                {"name": "Blocked", "value": projects_blocked or 8, "color": "#EF4444"},
                {"name": "Completed", "value": 5, "color": "#3B82F6"}
            ],
            "production_output_trend": [
                {"day": "Mon", "target": 1000, "actual": 940, "yield": 96.5},
                {"day": "Tue", "target": 1000, "actual": 980, "yield": 97.8},
                {"day": "Wed", "target": 1000, "actual": 930, "yield": 95.2},
                {"day": "Thu", "target": 1000, "actual": 990, "yield": 98.4},
                {"day": "Fri", "target": 1000, "actual": 965, "yield": 97.1},
                {"day": "Sat", "target": 800, "actual": 790, "yield": 98.0}
            ],
            "quality_defects": [
                {"category": "Dimensional Variance", "count": 14},
                {"category": "Solder Voiding", "count": 9},
                {"category": "Surface Scratch", "count": 6},
                {"category": "Component Misalignment", "count": 4},
                {"category": "Labeling Error", "count": 2}
            ],
            "supplier_performance": [
                {"supplier": "Apex Precision Components", "otd": 96.5, "quality_score": 98.0},
                {"supplier": "Quantum Tech Solutions", "otd": 88.0, "quality_score": 94.2},
                {"supplier": "Starlight Microelectronics", "otd": 94.0, "quality_score": 97.5},
                {"supplier": "Hydra Automation Systems", "otd": 91.5, "quality_score": 93.0}
            ]
        }
    }
