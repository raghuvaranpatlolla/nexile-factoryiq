from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Role, Site, AuditLog
from app.schemas.schemas import Token, LoginRequest, RegisterRequest, UserOut
from app.core.security import create_access_token, create_refresh_token, verify_password, get_password_hash
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Audit Log
    log = AuditLog(user_email=user.email, action="LOGIN", entity="User", entity_id=str(user.id), details="User logged in successfully")
    db.add(log)
    db.commit()

    role_name = user.role.name if user.role else "Viewer"
    site_code = user.site.code if user.site else None
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": role_name,
            "site_code": site_code,
            "department": user.department
        }
    }

@router.post("/register", response_model=UserOut)
def register(reg_data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == reg_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role = db.query(Role).filter(Role.name == reg_data.role_name).first()
    if not role:
        role = Role(name=reg_data.role_name, description=f"{reg_data.role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)

    site = db.query(Site).filter(Site.code == reg_data.site_code).first() if reg_data.site_code else None

    user = User(
        email=reg_data.email,
        hashed_password=get_password_hash(reg_data.password),
        full_name=reg_data.full_name,
        role_id=role.id,
        site_id=site.id if site else None,
        department=reg_data.department
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role_name=role.name,
        site_code=site.code if site else None,
        department=user.department,
        is_active=user.is_active
    )

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    role_name = current_user.role.name if current_user.role else "Viewer"
    site_code = current_user.site.code if current_user.site else None
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": role_name,
        "site_code": site_code,
        "department": current_user.department,
        "is_active": current_user.is_active
    }
