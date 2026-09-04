from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Role, Site, ActivityLog
from app.schemas.schemas import LoginRequest, Token, UserCreate, UserOut
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    role = db.query(Role).filter(Role.id == user.role_id).first()
    role_name = role.name if role else "Viewer"
    
    access_token = create_access_token(subject=user.id)
    
    # Log activity
    log = ActivityLog(user_id=user.id, user_email=user.email, action="LOGIN", entity_name="User", entity_id=str(user.id), details="Successful login")
    db.add(log)
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "job_title": user.job_title,
            "department": user.department,
            "role": role_name,
            "site_id": user.site_id
        }
    }

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        job_title=user_in.job_title,
        department=user_in.department,
        role_id=user_in.role_id,
        site_id=user_in.site_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
