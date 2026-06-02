from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/list", response_model=List[schemas.AppointmentResponse])
def list_appointments(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role == "patient":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient:
            return []
        return db.query(models.Appointment).filter(models.Appointment.patient_id == patient.id).all()
        
    elif current_user.role == "doctor":
        doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
        if not doctor:
            return []
        return db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor.id).all()
        
    elif current_user.role in ["nurse", "receptionist", "admin"]:
        return db.query(models.Appointment).all()
        
    raise HTTPException(status_code=403, detail="Role not authorized")

@router.post("/book", response_model=schemas.AppointmentResponse)
def book_appointment(
    appointment_in: schemas.AppointmentCreate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="Only patients can book appointments")
        
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment_in.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    # Create the appointment
    appointment = models.Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=appointment_in.appointment_date,
        type=appointment_in.type,
        symptoms_description=appointment_in.symptoms_description,
        status="pending_payment"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    # Create an associated payment record
    payment = models.Payment(
        appointment_id=appointment.id,
        amount=doctor.consultation_fee,
        status="pending"
    )
    db.add(payment)
    db.commit()
    db.refresh(appointment)
    
    return appointment

@router.put("/{appointment_id}", response_model=schemas.AppointmentResponse)
def update_appointment(
    appointment_id: int,
    update_in: schemas.AppointmentUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    # Security checks: patients can only cancel their own, doctors/nurses can modify status
    if current_user.role == "patient":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient or appointment.patient_id != patient.id:
            raise HTTPException(status_code=403, detail="Forbidden")
        if update_in.status not in ["cancelled"]:
            raise HTTPException(status_code=400, detail="Patients can only cancel appointments")
            
    elif current_user.role not in ["doctor", "nurse", "admin"]:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    for field, value in update_in.model_dump(exclude_unset=True).items():
        setattr(appointment, field, value)
        
    db.commit()
    db.refresh(appointment)
    return appointment

# --- Prescription Issuing ---
@router.post("/{appointment_id}/prescribe", response_model=schemas.PrescriptionResponse)
def issue_prescription(
    appointment_id: int,
    presc_in: schemas.PrescriptionBase,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=400, detail="Only doctors can write prescriptions")
        
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    
    if not appointment or appointment.doctor_id != doctor.id:
        raise HTTPException(status_code=403, detail="Access denied to this appointment")
        
    # Check if prescription already exists
    existing = db.query(models.Prescription).filter(models.Prescription.appointment_id == appointment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Prescription already issued for this appointment")

    # Serialize medicines back to JSON
    prescription = models.Prescription(
        appointment_id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=doctor.id,
        medicines=[m.model_dump() for m in presc_in.medicines],
        notes=presc_in.notes,
        pdf_url=f"/api/patients/prescriptions/download/{appointment.id}"
    )
    db.add(prescription)
    
    # Complete appointment status
    appointment.status = "completed"
    
    db.commit()
    db.refresh(prescription)
    return prescription

# --- Telemedicine peer keys generator ---
@router.post("/{appointment_id}/telemedicine/room")
def get_telemedicine_room(
    appointment_id: int,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    # Verify user belongs to this appointment
    if current_user.role == "patient":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient or appointment.patient_id != patient.id:
             raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == "doctor":
        doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
        if not doctor or appointment.doctor_id != doctor.id:
             raise HTTPException(status_code=403, detail="Access denied")
             
    # Return mock WebRTC signalling token
    return {
        "appointment_id": appointment_id,
        "room_id": f"room-medicore-{appointment_id}-{hash(appointment.created_at)}",
        "turn_servers": [
            {"urls": "stun:stun.l.google.com:19302"},
            {"urls": "turn:turn.medicore.platform:3478", "username": "medicore_demo", "credential": "security_mock_password"}
        ]
    }
