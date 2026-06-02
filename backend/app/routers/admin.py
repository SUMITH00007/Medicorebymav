from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

# Restrict the entire router to Administrator profiles
admin_checker = deps.RoleChecker(["admin"])

@router.get("/users", response_model=List[schemas.UserResponse], dependencies=[Depends(admin_checker)])
def list_all_users(db: Session = Depends(deps.get_db)):
    return db.query(models.User).all()

@router.post("/doctors/{doctor_id}/verify", response_model=schemas.DoctorResponse, dependencies=[Depends(admin_checker)])
def verify_doctor_license(doctor_id: int, db: Session = Depends(deps.get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
         raise HTTPException(status_code=404, detail="Doctor profile not found")
         
    doctor.is_verified = True
    db.commit()
    db.refresh(doctor)
    
    # Register this verification action in system audits
    audit = models.AuditLog(
        action="doctor_verify",
        details={"doctor_id": doctor_id, "license": doctor.license_number}
    )
    db.add(audit)
    db.commit()
    
    return doctor

@router.get("/audit-logs", response_model=List[schemas.AuditLogResponse], dependencies=[Depends(admin_checker)])
def read_audit_logs(db: Session = Depends(deps.get_db)):
    return db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).limit(100).all()

@router.get("/revenue", dependencies=[Depends(admin_checker)])
def get_revenue_analytics(db: Session = Depends(deps.get_db)):
    payments = db.query(models.Payment).filter(models.Payment.status == "completed").all()
    total_rev = sum(p.amount for p in payments)
    
    # Calculate revenue splits by payment channels
    methods = {}
    for p in payments:
        methods[p.payment_method or "unknown"] = methods.get(p.payment_method or "unknown", 0) + p.amount
        
    method_data = [{"method": k, "value": v} for k, v in methods.items()]
    
    # Basic monthly progression mock
    timeline = [
        {"name": "Jan", "revenue": total_rev * 0.1},
        {"name": "Feb", "revenue": total_rev * 0.15},
        {"name": "Mar", "revenue": total_rev * 0.22},
        {"name": "Apr", "revenue": total_rev * 0.28},
        {"name": "May", "revenue": total_rev * 0.25},
    ]

    return {
        "total_revenue": total_rev,
        "payment_methods": method_data,
        "timeline_analytics": timeline,
        "completed_transactions": len(payments)
    }
