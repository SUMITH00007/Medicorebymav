from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/list", response_model=List[schemas.DoctorResponse])
def list_doctors(
    specialty: Optional[str] = None,
    is_verified: Optional[bool] = None,
    db: Session = Depends(deps.get_db)
):
    query = db.query(models.Doctor)
    if specialty:
        query = query.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))
    if is_verified is not None:
        query = query.filter(models.Doctor.is_verified == is_verified)
    else:
        # Default: only show verified doctors to patients
        query = query.filter(models.Doctor.is_verified == True)
        
    return query.all()

@router.get("/profile", response_model=schemas.DoctorResponse)
def get_doctor_profile(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=400, detail="User is not a doctor")
        
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return doctor

@router.put("/profile", response_model=schemas.DoctorResponse)
def update_doctor_profile(
    profile_in: schemas.DoctorUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=400, detail="User is not a doctor")
        
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        if field == "is_verified" and current_user.role != "admin":
            continue  # Only admins can verify doctors
        setattr(doctor, field, value)
        
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/earnings")
def get_doctor_earnings(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=400, detail="User is not a doctor")
        
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    # Fetch completed paid appointments
    payments = db.query(models.Payment)\
        .join(models.Appointment)\
        .filter(models.Appointment.doctor_id == doctor.id)\
        .filter(models.Payment.status == "completed")\
        .all()
        
    total_earnings = sum(p.amount for p in payments)
    completed_visits = len(payments)
    
    # Simple monthly distribution mock for dashboard charts
    earnings_chart = [
        {"month": "Jan", "amount": total_earnings * 0.1},
        {"month": "Feb", "amount": total_earnings * 0.15},
        {"month": "Mar", "amount": total_earnings * 0.2},
        {"month": "Apr", "amount": total_earnings * 0.25},
        {"month": "May", "amount": total_earnings * 0.3},
    ]

    return {
        "total_earnings": total_earnings,
        "completed_visits": completed_visits,
        "consultation_fee": doctor.consultation_fee,
        "monthly_breakdown": earnings_chart
    }
