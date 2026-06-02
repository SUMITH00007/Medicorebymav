from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core import security, deps
from app.models import models
from app.schemas import schemas
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(deps.get_db), request: Request = None):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email address already exists."
        )

    # Hash the password
    hashed_password = security.get_password_hash(user_in.password)
    
    # Create the user
    user = models.User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone=user_in.phone,
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/adventurer/svg?seed={user_in.first_name}",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Cascade profile creations
    if user.role == "patient":
        patient = models.Patient(
            user_id=user.id,
            medical_history=[],
            allergies=[]
        )
        db.add(patient)
    elif user.role == "doctor":
        # Create unverified doctor slot
        doctor = models.Doctor(
            user_id=user.id,
            specialty="General Practice",
            license_number=f"LIC-{user.id}-{datetime.utcnow().year}",
            bio="Practitioner awaiting credential verification",
            consultation_fee=60.0,
            is_verified=False
        )
        db.add(doctor)
    elif user.role in ["nurse", "receptionist", "admin"]:
        staff = models.Staff(
            user_id=user.id,
            role=user.role
        )
        db.add(staff)

    db.commit()

    # Log the audit action
    ip_addr = request.client.host if request and request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown") if request else "Unknown"
    audit = models.AuditLog(
        user_id=user.id,
        action="user_register",
        ip_address=ip_addr,
        user_agent=ua,
        details={"email": user.email, "role": user.role}
    )
    db.add(audit)
    db.commit()

    return user

@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.LoginRequest, db: Session = Depends(deps.get_db), request: Request = None):
    # Verify user
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not security.verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user profile"
        )

    # Log login action
    ip_addr = request.client.host if request and request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown") if request else "Unknown"
    audit = models.AuditLog(
        user_id=user.id,
        action="user_login",
        ip_address=ip_addr,
        user_agent=ua,
        details={"status": "success"}
    )
    db.add(audit)
    db.commit()

    # Create access token
    access_token = security.create_access_token(subject=user.id, role=user.role)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }

@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user
