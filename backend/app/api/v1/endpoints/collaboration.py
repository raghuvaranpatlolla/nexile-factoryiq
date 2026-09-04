from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/threads")
def get_discussion_threads(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return [
        {
            "id": 1,
            "project_name": "Project Alpha (NextGen ECU)",
            "title": "Design Review Feedback on Heat Sink Clearance",
            "author": "Dr. Rajesh Kumar (R&D Lead)",
            "date": "2026-08-30 14:20",
            "replies_count": 5,
            "latest_comment": "Thermal simulation confirmed 1.5mm clearance is safe."
        },
        {
            "id": 2,
            "project_name": "Project Beta (EV Power Inverter)",
            "title": "Supplier Material Delay Notification",
            "author": "Suresh Nair (Procurement Manager)",
            "date": "2026-08-31 09:15",
            "replies_count": 3,
            "latest_comment": "Starlight Microelectronics confirmed ship date moved to Friday."
        }
    ]
