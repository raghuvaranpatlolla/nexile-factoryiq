from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Project, Milestone, ProjectRisk, ProjectIssue, Customer, Site, Program, Product, AuditLog
from app.schemas.schemas import ProjectCreate, ProjectOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProjectOut])
def list_projects(
    status: Optional[str] = None,
    site_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Project)
    if status:
        query = query.filter(Project.status == status)
    if site_id:
        query = query.filter(Project.site_id == site_id)
    
    projects = query.all()
    result = []
    for p in projects:
        result.append(ProjectOut(
            id=p.id,
            project_id_code=p.project_id_code,
            name=p.name,
            customer_name=p.customer.name if p.customer else "Acme Corp",
            site_name=p.site.name if p.site else "Hyderabad Facility",
            manager_name=p.manager_name,
            start_date=p.start_date,
            target_date=p.target_date,
            status=p.status,
            health=p.health,
            priority=p.priority,
            progress_pct=p.progress_pct,
            description=p.description
        ))
    return result

@router.get("/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    milestones = db.query(Milestone).filter(Milestone.project_id == p.id).all()
    risks = db.query(ProjectRisk).filter(ProjectRisk.project_id == p.id).all()
    issues = db.query(ProjectIssue).filter(ProjectIssue.project_id == p.id).all()

    return {
        "project": ProjectOut(
            id=p.id,
            project_id_code=p.project_id_code,
            name=p.name,
            customer_name=p.customer.name if p.customer else "Acme Corp",
            site_name=p.site.name if p.site else "Hyderabad Facility",
            manager_name=p.manager_name,
            start_date=p.start_date,
            target_date=p.target_date,
            status=p.status,
            health=p.health,
            priority=p.priority,
            progress_pct=p.progress_pct,
            description=p.description
        ),
        "milestones": milestones,
        "risks": risks,
        "issues": issues,
        "bom_summary": [
            {"part_number": "MCU-8842", "description": "ARM Cortex M4 Processor", "qty": 1, "status": "Approved"},
            {"part_number": "PCB-MAIN-V2", "description": "6-Layer HDI Motherboard", "qty": 1, "status": "Approved"},
            {"part_number": "PWR-MOD-5V", "description": "Isolated DC-DC Regulator", "qty": 2, "status": "Pending ECO"}
        ],
        "work_orders": [
            {"wo_number": "WO-9901", "line": "Line A (Hyderabad)", "shift": "Morning", "target": 500, "actual": 485, "yield_pct": 98.2, "status": "In Progress"},
            {"wo_number": "WO-9902", "line": "Line B (Bangalore)", "shift": "Evening", "target": 300, "actual": 290, "yield_pct": 96.8, "status": "In Progress"}
        ]
    }

@router.post("", response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    p = Project(
        project_id_code=payload.project_id_code,
        name=payload.name,
        customer_id=payload.customer_id,
        site_id=payload.site_id,
        manager_name=payload.manager_name,
        start_date=payload.start_date,
        target_date=payload.target_date,
        status=payload.status,
        health=payload.health,
        priority=payload.priority,
        description=payload.description,
        progress_pct=0.0
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    # Seed default milestones for NPI/Project lifecycle
    default_milestones = [
        {"name": "Requirements Freeze", "phase": "Requirements", "due_date": payload.start_date, "status": "Completed"},
        {"name": "Preliminary Design Review (PDR)", "phase": "Design Review", "due_date": payload.start_date, "status": "In Progress"},
        {"name": "EVT Prototype Build", "phase": "Prototype", "due_date": payload.target_date, "status": "Pending"},
        {"name": "Mass Production Launch (SOP)", "phase": "Launch", "due_date": payload.target_date, "status": "Pending"}
    ]
    for ms in default_milestones:
        db.add(Milestone(project_id=p.id, **ms))
    db.commit()

    log = AuditLog(user_email=current_user.email, action="CREATE_PROJECT", entity="Project", entity_id=str(p.id), details=f"Created project {p.name}")
    db.add(log)
    db.commit()

    cust = db.query(Customer).get(p.customer_id)
    site = db.query(Site).get(p.site_id)

    return ProjectOut(
        id=p.id,
        project_id_code=p.project_id_code,
        name=p.name,
        customer_name=cust.name if cust else "Acme Corp",
        site_name=site.name if site else "Hyderabad Facility",
        manager_name=p.manager_name,
        start_date=p.start_date,
        target_date=p.target_date,
        status=p.status,
        health=p.health,
        priority=p.priority,
        progress_pct=p.progress_pct,
        description=p.description
    )
