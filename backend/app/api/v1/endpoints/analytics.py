from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/metrics")
def get_analytics_metrics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return {
        "project_delivery_otd_pct": 94.8,
        "first_pass_yield_pct": 97.4,
        "overall_equipment_effectiveness_oee": 88.6,
        "supplier_quality_index": 95.2,
        "rma_resolution_avg_days": 3.4,
        "compliance_readiness_score": 99.1,
        "monthly_trend": [
            {"month": "Jan", "yield": 95.8, "otd": 92.0, "oee": 85.0},
            {"month": "Feb", "yield": 96.2, "otd": 93.5, "oee": 86.4},
            {"month": "Mar", "yield": 96.9, "otd": 94.0, "oee": 87.2},
            {"month": "Apr", "yield": 97.1, "otd": 94.8, "oee": 88.0},
            {"month": "May", "yield": 97.4, "otd": 95.2, "oee": 88.6}
        ]
    }
