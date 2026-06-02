from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/profile", response_model=schemas.PatientResponse)
def get_patient_profile(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="User is not a patient")
    
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient

@router.put("/profile", response_model=schemas.PatientResponse)
def update_patient_profile(
    profile_in: schemas.PatientUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="User is not a patient")
    
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)
        
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/records", response_model=List[schemas.MedicalRecordResponse])
def get_medical_records(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Patients view their own, Doctors/Nurses view patients records
    if current_user.role == "patient":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient record not found")
        patient_id = patient.id
    elif current_user.role in ["doctor", "nurse", "admin"]:
        # Endpoint can be filtered by patient_id using query param, or returns empty list
        raise HTTPException(status_code=400, detail="Specify patient ID via queries or direct fetch")
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    records = db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == patient_id).all()
    return records

@router.get("/records/{patient_id}", response_model=List[schemas.MedicalRecordResponse])
def get_patient_records_by_id(
    patient_id: int,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Make sure doctor/nurse/admin is logged in
    if current_user.role not in ["doctor", "nurse", "admin"]:
        # Patient can only view their own records
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        if not patient or patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
            
    records = db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == patient_id).all()
    return records

@router.get("/prescriptions/download/{appointment_id}")
def download_prescription(
    appointment_id: int,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    from fastapi.responses import StreamingResponse
    from app.services.pdf import generate_prescription_pdf

    prescription = db.query(models.Prescription).filter(models.Prescription.appointment_id == appointment_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # Security check: User must be either the patient, the doctor, or an admin
    patient = db.query(models.Patient).filter(models.Patient.id == prescription.patient_id).first()
    doctor = db.query(models.Doctor).filter(models.Doctor.id == prescription.doctor_id).first()
    
    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Incomplete clinical reference models")

    if current_user.role == "patient":
        if patient.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied to this record")
    elif current_user.role == "doctor":
        if doctor.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied to this record")
    elif current_user.role not in ["nurse", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    user_patient = db.query(models.User).filter(models.User.id == patient.user_id).first()
    user_doctor = db.query(models.User).filter(models.User.id == doctor.user_id).first()

    pdf_buffer = generate_prescription_pdf(
        prescription=prescription,
        doctor=doctor,
        patient=patient,
        user_doctor=user_doctor,
        user_patient=user_patient
    )
    
    filename = f"prescription_appt_{appointment_id}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

