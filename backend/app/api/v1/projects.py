from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Project, Milestone, ProjectRisk, ProjectIssue, Customer, Site, Product, ActivityLog
from app.schemas.schemas import ProjectOut, ProjectCreate, MilestoneOut

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
def get_projects(
    search: Optional[str] = None,
    site_id: Optional[int] = None,
    status: Optional[str] = None,
    health: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if search:
        query = query.filter((Project.name.ilike(f"%{search}%")) | (Project.project_code.ilike(f"%{search}%")))
    if site_id:
        query = query.filter(Project.site_id == site_id)
    if status:
        query = query.filter(Project.status == status)
    if health:
        query = query.filter(Project.health == health)
    
    projects = query.order_by(Project.id.desc()).limit(limit).all()
    
    # Populate readable customer & site names
    result = []
    for p in projects:
        p_dict = ProjectOut.model_validate(p)
        if p.customer:
            p_dict.customer_name = p.customer.name
        if p.site:
            p_dict.site_name = p.site.name
        result.append(p_dict)
        
    return result

@router.post("", response_model=ProjectOut)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.project_code == project_in.project_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project code already exists")
        
    proj = Project(**project_in.model_dump())
    db.add(proj)
    db.commit()
    db.refresh(proj)
    
    # Add initial standard milestones
    phases = [
        ("Kickoff & Concept Sign-off", "R&D"),
        ("Preliminary Design Review (PDR)", "Engineering"),
        ("Critical Design Review (CDR)", "Engineering"),
        ("NPI Tooling & Jig Qualification", "NPI"),
        ("Pilot Build & PPAP Level 3", "Qualification"),
        ("Mass Production Ramp", "Launch")
    ]
    for title, phase in phases:
        ms = Milestone(
            project_id=proj.id,
            title=title,
            phase=phase,
            due_date=proj.start_date,
            status="Pending"
        )
        db.add(ms)
    
    # Audit log
    log = ActivityLog(user_email="system@factoryiq.com", action="CREATE", entity_name="Project", entity_id=str(proj.id), details=f"Created project {proj.project_code} - {proj.name}")
    db.add(log)
    db.commit()
    
    p_dict = ProjectOut.model_validate(proj)
    return p_dict

@router.get("/{project_id}", response_model=ProjectOut)
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
        
    p_dict = ProjectOut.model_validate(proj)
    if proj.customer:
        p_dict.customer_name = proj.customer.name
    if proj.site:
        p_dict.site_name = proj.site.name
    return p_dict

@router.put("/{project_id}/milestones/{milestone_id}")
def update_milestone_status(project_id: int, milestone_id: int, status: str, db: Session = Depends(get_db)):
    ms = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.project_id == project_id).first()
    if not ms:
        raise HTTPException(status_code=404, detail="Milestone not found")
    ms.status = status
    db.commit()
    return {"message": "Milestone status updated successfully", "status": ms.status}
