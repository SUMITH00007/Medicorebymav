from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- Token & Authentication Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    email: str
    first_name: str
    last_name: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class MFARequest(BaseModel):
    email: EmailStr
    code: str

# --- User Base & Response ---
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str  # patient, doctor, nurse, receptionist, admin
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    mfa_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Department Schemas ---
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True

# --- Patient Profile Schemas ---
class PatientBase(BaseModel):
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[List[str]] = []
    allergies: Optional[List[str]] = []

class PatientCreate(PatientBase):
    user_id: int

class PatientUpdate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    user_id: int
    user: UserResponse

    class Config:
        from_attributes = True

# --- Doctor Profile Schemas ---
class DoctorBase(BaseModel):
    specialty: str
    license_number: str
    bio: Optional[str] = None
    consultation_fee: float = 50.0
    experience_years: int = 0
    availability: Optional[Dict[str, List[str]]] = None  # e.g., {"Monday": ["09:00", "10:00"]}

class DoctorCreate(DoctorBase):
    user_id: int
    department_id: Optional[int] = None

class DoctorUpdate(DoctorBase):
    department_id: Optional[int] = None
    is_verified: Optional[bool] = None

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    department_id: Optional[int] = None
    is_verified: bool
    user: UserResponse
    department: Optional[DepartmentResponse] = None

    class Config:
        from_attributes = True

# --- Staff Profile Schemas ---
class StaffBase(BaseModel):
    role: str
    department_id: Optional[int] = None

class StaffCreate(StaffBase):
    user_id: int

class StaffResponse(StaffBase):
    id: int
    user_id: int
    user: UserResponse
    department: Optional[DepartmentResponse] = None
    hire_date: datetime

    class Config:
        from_attributes = True

# --- Appointment Schemas ---
class AppointmentBase(BaseModel):
    appointment_date: datetime
    type: str = "in_person"  # telemedicine, in_person
    symptoms_description: Optional[str] = None

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: datetime
    type: str = "in_person"
    symptoms_description: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class MedicineSchema(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str

# --- Prescription Schemas ---
class PrescriptionBase(BaseModel):
    medicines: List[MedicineSchema]
    notes: Optional[str] = None

class PrescriptionCreate(PrescriptionBase):
    appointment_id: int

class PrescriptionResponse(PrescriptionBase):
    id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    issue_date: datetime
    pdf_url: Optional[str] = None

    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentCreate(BaseModel):
    appointment_id: int
    amount: float
    payment_method: str = "stripe"

class PaymentResponse(BaseModel):
    id: int
    appointment_id: int
    amount: float
    status: str
    transaction_id: Optional[str] = None
    payment_method: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Complete Appointment Response ---
class AppointmentResponse(AppointmentBase):
    id: int
    patient_id: int
    doctor_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime
    doctor: DoctorResponse
    patient: PatientResponse
    prescription: Optional[PrescriptionResponse] = None
    payment: Optional[PaymentResponse] = None

    class Config:
        from_attributes = True

# --- Medical Record Schemas ---
class MedicalRecordCreate(BaseModel):
    patient_id: int
    record_type: str  # lab_report, imaging, history, immunization
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None

class MedicalRecordResponse(MedicalRecordCreate):
    id: int
    uploaded_by: int
    date_recorded: datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    is_read: bool
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Message Schemas ---
class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    sent_at: datetime

    class Config:
        from_attributes = True

# --- Audit Log Schemas ---
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Feature Schemas ---
class SymptomCheckRequest(BaseModel):
    symptoms: str

class SymptomCheckResponse(BaseModel):
    analysis: str
    possible_diagnoses: List[str]
    recommended_specialists: List[str]
    urgency_level: str  # Low, Medium, High, Emergency

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    reply: str
    recommended_specialty: Optional[str] = None
