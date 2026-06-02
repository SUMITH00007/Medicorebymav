from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/checkout", response_model=schemas.PaymentResponse)
def checkout_payment(
    checkout_in: schemas.PaymentCreate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="Only patients can make checkout payments")
        
    payment = db.query(models.Payment).filter(models.Payment.appointment_id == checkout_in.appointment_id).first()
    if not payment:
         raise HTTPException(status_code=404, detail="Payment ledger invoice not found")
         
    if payment.status == "completed":
        raise HTTPException(status_code=400, detail="Invoice already paid and completed")
        
    # Process payment (mock secure bank confirmation)
    payment.status = "completed"
    payment.transaction_id = f"tx_cs_{uuid.uuid4().hex[:12]}"
    payment.payment_method = checkout_in.payment_method
    
    # Update appointment status from "pending_payment" to "scheduled"
    appointment = db.query(models.Appointment).filter(models.Appointment.id == checkout_in.appointment_id).first()
    if appointment and appointment.status == "pending_payment":
        appointment.status = "scheduled"
        
    db.commit()
    db.refresh(payment)
    return payment

@router.get("/history", response_model=List[schemas.PaymentResponse])
def get_payment_history(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role == "patient":
        # Join payments on appointments and patient profiles
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient:
            return []
        return db.query(models.Payment)\
            .join(models.Appointment)\
            .filter(models.Appointment.patient_id == patient.id)\
            .all()
            
    elif current_user.role in ["admin", "receptionist"]:
        return db.query(models.Payment).all()
        
    raise HTTPException(status_code=403, detail="Access denied")
