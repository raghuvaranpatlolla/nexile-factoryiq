from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import KnowledgeArticle
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/articles")
def list_knowledge_articles(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    articles = db.query(KnowledgeArticle).all()
    if not articles:
        return [
            {
                "id": 1,
                "title": "SMT Line Reflow Oven Temperature Calibration Procedure",
                "category": "Manufacturing SOP",
                "content": "Standard operating procedure detailing thermocouples placement, ramp-up rates, peak soak time (217°C - 245°C), and cooling profile parameters for lead-free SAC305 solder alloy.",
                "author": "Anil Reddy (Quality Engineer)",
                "created_at": "2026-08-15"
            },
            {
                "id": 2,
                "title": "ISO 9001:2015 Internal Audit Checklist & Evidence Guide",
                "category": "Quality & Compliance",
                "content": "Step-by-step guidance on document control, risk assessment matrix, change management notifications, and corrective action effectiveness verification.",
                "author": "Priya Sharma (Quality Director)",
                "created_at": "2026-08-10"
            }
        ]
    return articles
