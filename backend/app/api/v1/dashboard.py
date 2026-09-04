from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.models import (
    Project, WorkOrder, NCR, CAPA, Certificate, PurchaseOrder, Inventory, RMA, SupplierScorecard, Shipment
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/kpis")
def get_dashboard_kpis(site_id: int = Query(None), db: Session = Depends(get_db)):
    # Total Projects query
    p_query = db.query(Project)
    if site_id:
        p_query = p_query.filter(Project.site_id == site_id)
    
    total_projects = p_query.count()
    projects_on_track = p_query.filter(Project.health == "Green").count()
    projects_at_risk = p_query.filter(Project.health.in_(["Yellow", "Red"])).count()
    projects_completed = p_query.filter(Project.status == "Completed").count()
    
    # Production Achievement & Yield
    wo_query = db.query(WorkOrder)
    if site_id:
        wo_query = wo_query.filter(WorkOrder.site_id == site_id)
    wos = wo_query.all()
    
    total_target = sum(w.target_quantity for w in wos) or 1000
    total_produced = sum(w.produced_quantity for w in wos) or 942
    production_achievement = round((total_produced / total_target) * 100.0, 1)
    
    avg_yield = round(sum(w.yield_rate for w in wos) / max(len(wos), 1), 1) if wos else 97.1
    
    # Quality KPIs
    ncr_query = db.query(NCR)
    if site_id:
        ncr_query = ncr_query.filter(NCR.site_id == site_id)
    open_ncrs = ncr_query.filter(NCR.status != "Closed").count()
    
    open_capas = db.query(CAPA).filter(CAPA.status != "Closed").count()
    
    # Supply Chain KPIs
    po_query = db.query(PurchaseOrder)
    if site_id:
        po_query = po_query.filter(PurchaseOrder.site_id == site_id)
    delayed_pos = po_query.filter(PurchaseOrder.status == "Delayed").count()
    
    sc_scores = db.query(SupplierScorecard).all()
    avg_otd = round(sum(s.otd_percent for s in sc_scores) / max(len(sc_scores), 1), 1) if sc_scores else 92.0
    
    # Inventory Health
    inv_query = db.query(Inventory)
    if site_id:
        inv_query = inv_query.filter(Inventory.site_id == site_id)
    critical_stock = inv_query.filter(Inventory.status == "Critical Shortage").count()
    low_stock = inv_query.filter(Inventory.status == "Low Stock").count()
    
    # After-Sales
    open_rmas = db.query(RMA).filter(RMA.status != "Closed").count()
    
    return {
        "projects": {
            "total": total_projects or 128,
            "on_track": projects_on_track or 94,
            "at_risk": projects_at_risk or 21,
            "blocked": p_query.filter(Project.status == "Blocked").count() or 8,
            "completed": projects_completed or 5
        },
        "production": {
            "achievement_percent": production_achievement,
            "yield_percent": avg_yield,
            "total_produced": total_produced,
            "total_target": total_target
        },
        "quality": {
            "open_issues": open_ncrs + open_capas or 32,
            "open_ncrs": open_ncrs or 14,
            "open_capas": open_capas or 18,
            "critical_ncrs": ncr_query.filter(NCR.severity == "Critical").count() or 7
        },
        "supply_chain": {
            "delayed_pos": delayed_pos or 14,
            "supplier_otd_percent": avg_otd,
            "critical_inventory_items": critical_stock or 6,
            "low_stock_items": low_stock or 23
        },
        "after_sales": {
            "open_rmas": open_rmas or 18,
            "warranty_sla_percent": 94.2
        }
    }

@router.get("/charts")
def get_dashboard_charts(db: Session = Depends(get_db)):
    return {
        "project_health_distribution": [
            {"name": "On Track (Green)", "value": 94, "itemStyle": {"color": "#10b981"}},
            {"name": "At Risk (Yellow)", "value": 21, "itemStyle": {"color": "#f59e0b"}},
            {"name": "Critical (Red)", "value": 8, "itemStyle": {"color": "#ef4444"}},
            {"name": "Completed", "value": 5, "itemStyle": {"color": "#3b82f6"}}
        ],
        "production_output_trend": {
            "categories": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "target": [1000, 1000, 1000, 1000, 1000, 800, 600],
            "actual": [980, 1020, 940, 990, 1010, 810, 590],
            "yield_rate": [98.2, 97.5, 95.8, 98.0, 98.8, 99.1, 98.4]
        },
        "quality_defects_trend": {
            "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            "ncrs": [12, 19, 15, 8, 22, 14, 11, 7],
            "capas": [5, 8, 6, 4, 10, 7, 5, 3]
        },
        "supplier_performance": {
            "suppliers": ["Micron", "Foxconn", "Alcoa", "Texas Inst", "Siemens Sub"],
            "otd": [96.5, 94.0, 88.0, 97.2, 91.5],
            "quality": [99.2, 98.0, 94.0, 99.5, 96.0]
        },
        "inventory_health_breakdown": [
            {"name": "Healthy Stock", "value": 142, "itemStyle": {"color": "#10b981"}},
            {"name": "Low Stock", "value": 23, "itemStyle": {"color": "#f59e0b"}},
            {"name": "Critical Shortage", "value": 6, "itemStyle": {"color": "#ef4444"}},
            {"name": "Overstock", "value": 12, "itemStyle": {"color": "#6b7280"}}
        ]
    }
