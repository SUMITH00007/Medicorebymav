import sys
import os
import datetime
from sqlalchemy.orm import Session

# Add current path to python path to run app imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core import security, database
from app.models import models

def seed_database():
    db = database.SessionLocal()
    
    try:
        print("Checking existing records...")
        if db.query(models.User).filter(models.User.email == "admin@medicore.com").first():
            print("Database already seeded. Skipping.")
            return

        print("Initializing Medicore Database Seeding...")

        # 1. Create Departments
        print("Creating departments...")
        depts_data = [
            {"name": "Cardiology", "description": "Expert heart and vascular surgical and therapeutics support.", "image_url": "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?w=150"},
            {"name": "Neurology", "description": "Neurological conditions and neuromuscular therapeutics care.", "image_url": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=150"},
            {"name": "Pediatrics", "description": "Comprehensive primary, specialty, and wellness clinical care for children.", "image_url": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150"},
            {"name": "Dermatology", "description": "Advanced care for skin, hair, nails, and complexion elements.", "image_url": "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150"},
            {"name": "General Practice", "description": "Comprehensive primary healthcare wellness checkups.", "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150"}
        ]
        
        depts = []
        for d in depts_data:
            dept = models.Department(**d)
            db.add(dept)
            depts.append(dept)
        db.commit()
        print(f"Created {len(depts)} departments.")

        # Helper password hash
        p_hash = security.get_password_hash("password123")

        # 2. Create Admin User
        print("Creating admin...")
        admin = models.User(
            email="admin@medicore.com",
            hashed_password=p_hash,
            role="admin",
            first_name="Aditi",
            last_name="Sharma",
            avatar_url="https://api.dicebear.com/7.x/adventurer/svg?seed=Aditi",
            phone="+91 99999 11111",
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        admin_staff = models.Staff(
            user_id=admin.id,
            role="admin"
        )
        db.add(admin_staff)
        db.commit()

        # 3. Create Doctors
        print("Creating doctors...")
        doctors_data = [
            {
                "email": "rajesh@medicore.com",
                "first_name": "Rajesh",
                "last_name": "Sharma",
                "specialty": "Cardiology",
                "license_number": "LIC-CARD-001",
                "bio": "Pioneer cardiologist specializing in congestive failure therapies and vascular catheterization.",
                "consultation_fee": 800.0,
                "experience_years": 15,
                "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh",
                "dept_idx": 0,
                "availability": {
                    "Monday": ["09:30 AM", "10:30 AM", "02:00 PM"],
                    "Wednesday": ["09:30 AM", "10:30 AM", "02:00 PM"],
                    "Friday": ["09:30 AM", "10:30 AM", "02:00 PM"]
                }
            },
            {
                "email": "anjali@medicore.com",
                "first_name": "Anjali",
                "last_name": "Mehta",
                "specialty": "Neurology",
                "license_number": "LIC-NEUR-999",
                "bio": "Renowned diagnostician and neuro-specialist. Likes solving cases. High attention to micro-details.",
                "consultation_fee": 1500.0,
                "experience_years": 22,
                "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=Anjali",
                "dept_idx": 1,
                "availability": {
                    "Tuesday": ["11:00 AM", "01:30 PM", "03:00 PM"],
                    "Thursday": ["11:00 AM", "01:30 PM", "03:00 PM"]
                }
            },
            {
                "email": "amit@medicore.com",
                "first_name": "Amit",
                "last_name": "Verma",
                "specialty": "Pediatrics",
                "license_number": "LIC-PEDI-777",
                "bio": "Dedicated clinical pediatrician focused on immunology, immunization protocols, and early health growth models.",
                "consultation_fee": 600.0,
                "experience_years": 18,
                "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit",
                "dept_idx": 2,
                "availability": {
                    "Monday": ["09:00 AM", "10:00 AM", "11:00 AM"],
                    "Tuesday": ["09:00 AM", "10:00 AM", "11:00 AM"],
                    "Thursday": ["14:00 AM", "15:00 AM", "16:00 AM"]
                }
            }
        ]

        doctors = []
        for doc in doctors_data:
            u = models.User(
                email=doc["email"],
                hashed_password=p_hash,
                role="doctor",
                first_name=doc["first_name"],
                last_name=doc["last_name"],
                avatar_url=doc["avatar_url"],
                phone="+91 98765 00001",
                is_active=True
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            
            d_profile = models.Doctor(
                user_id=u.id,
                department_id=depts[doc["dept_idx"]].id,
                specialty=doc["specialty"],
                license_number=doc["license_number"],
                bio=doc["bio"],
                consultation_fee=doc["consultation_fee"],
                experience_years=doc["experience_years"],
                availability=doc["availability"],
                rating=4.9,
                is_verified=True
            )
            db.add(d_profile)
            db.commit()
            doctors.append(d_profile)

        # 4. Create Patients
        print("Creating patients...")
        patients_data = [
            {
                "email": "patient@medicore.com",
                "first_name": "Priya",
                "last_name": "Sharma",
                "dob": "1985-11-10",
                "gender": "Female",
                "blood_group": "A-Negative",
                "address": "Flat 402, Shanti Vihar, Bandra West, Mumbai, MH",
                "emergency_name": "Rohan Sharma",
                "emergency_phone": "+91 98765 43210",
                "history": ["Post-traumatic anxiety", "Tendon strain (healed)"],
                "allergies": ["Penicillin", "Sulfa drugs"]
            },
            {
                "email": "johndoe@medicore.com",
                "first_name": "Aarav",
                "last_name": "Patel",
                "dob": "1990-05-15",
                "gender": "Male",
                "blood_group": "O-Positive",
                "address": "742, Lotus Residency, Indiranagar, Bengaluru, KA",
                "emergency_name": "Jane Patel",
                "emergency_phone": "+91 91234 56789",
                "history": ["Seasonal asthma", "High fitness profile"],
                "allergies": ["Peanuts", "Dust mites"]
            }
        ]

        patients = []
        for pat in patients_data:
            u = models.User(
                email=pat["email"],
                hashed_password=p_hash,
                role="patient",
                first_name=pat["first_name"],
                last_name=pat["last_name"],
                avatar_url=f"https://api.dicebear.com/7.x/adventurer/svg?seed={pat['first_name']}",
                phone="+91 98765 00002",
                is_active=True
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            
            p_profile = models.Patient(
                user_id=u.id,
                date_of_birth=pat["dob"],
                gender=pat["gender"],
                blood_group=pat["blood_group"],
                address=pat["address"],
                emergency_contact_name=pat["emergency_name"],
                emergency_contact_phone=pat["emergency_phone"],
                medical_history=pat["history"],
                allergies=pat["allergies"]
            )
            db.add(p_profile)
            db.commit()
            patients.append(p_profile)

        # 5. Create Appointments & Payments
        print("Creating historical appointments & payment logs...")
        
        # Appointment 1: Completed, paid
        appt1 = models.Appointment(
            patient_id=patients[0].id,
            doctor_id=doctors[0].id,
            appointment_date=datetime.datetime.utcnow() - datetime.timedelta(days=12),
            status="completed",
            type="telemedicine",
            symptoms_description="Sudden cardiac palpitations and minor fatigue during running drills.",
            notes="Patient exhibits strong cardiorespiratory baseline. EKG reading normal. Palpitations diagnosed as sleep-related caffeine amplification."
        )
        db.add(appt1)
        db.commit()
        db.refresh(appt1)

        pay1 = models.Payment(
            appointment_id=appt1.id,
            amount=doctors[0].consultation_fee,
            status="completed",
            transaction_id="tx_cs_39ab7d2c1840",
            payment_method="stripe"
        )
        db.add(pay1)

        # Create Prescription for Appt 1
        presc1 = models.Prescription(
            appointment_id=appt1.id,
            patient_id=patients[0].id,
            doctor_id=doctors[0].id,
            medicines=[
                {"name": "Magnesium Oxide", "dosage": "400mg", "frequency": "Once daily with food", "duration": "30 days"},
                {"name": "Pantocid (Alternative)", "dosage": "40mg", "frequency": "Empty stomach in the morning", "duration": "As needed"}
            ],
            notes="Restrict caffeine ingestion past 2:00 PM. Follow hydration protocols daily.",
            pdf_url=f"/api/patients/prescriptions/download/{appt1.id}"
        )
        db.add(presc1)
        
        # Create Lab record for Sarah Connor (Sarah Connor has patient id patients[0].id)
        lab1 = models.MedicalRecord(
            patient_id=patients[0].id,
            record_type="lab_report",
            title="Complete Lipid & Blood Profile",
            description="Analyzed LDL, HDL, Triglycerides, Hemoglobin A1C. Fasting blood glucose: 88 mg/dL. LDL slightly elevated, otherwise optimal.",
            file_url="/records/priya_lipid_test.pdf",
            uploaded_by=doctors[0].user_id
        )
        db.add(lab1)

        # Appointment 2: Scheduled, paid (Future appointment)
        appt2 = models.Appointment(
            patient_id=patients[0].id,
            doctor_id=doctors[1].id,
            appointment_date=datetime.datetime.utcnow() + datetime.timedelta(days=2),
            status="scheduled",
            type="in_person",
            symptoms_description="Routine annual migraine diagnosis check and medication adjustment reviews."
        )
        db.add(appt2)
        db.commit()
        db.refresh(appt2)

        pay2 = models.Payment(
            appointment_id=appt2.id,
            amount=doctors[1].consultation_fee,
            status="completed",
            transaction_id="tx_cs_89dd3e81fc04",
            payment_method="stripe"
        )
        db.add(pay2)

        # Appointment 3: Pending Payment (Future)
        appt3 = models.Appointment(
            patient_id=patients[1].id,
            doctor_id=doctors[2].id,
            appointment_date=datetime.datetime.utcnow() + datetime.timedelta(days=3),
            status="pending_payment",
            type="telemedicine",
            symptoms_description="Child seasonal allergy consultation."
        )
        db.add(appt3)
        db.commit()
        db.refresh(appt3)

        pay3 = models.Payment(
            appointment_id=appt3.id,
            amount=doctors[2].consultation_fee,
            status="pending"
        )
        db.add(pay3)

        # 6. Notifications
        print("Creating notifications...")
        notifs_data = [
            {"user_id": patients[0].user_id, "title": "Appointment Completed", "message": "Your consultation with Dr. Rajesh Sharma was completed. Access your digital prescription now.", "type": "appointment"},
            {"user_id": patients[0].user_id, "title": "Upcoming Appointment Reminder", "message": "Friendly reminder: Your checkup with Dr. Anjali Mehta is scheduled in 2 days.", "type": "reminder"},
            {"user_id": doctors[0].user_id, "title": "New Appointment Booked", "message": "Patient Priya Sharma has scheduled a cardiovascular telemedicine review.", "type": "appointment"}
        ]
        for n in notifs_data:
            notif = models.Notification(**n)
            db.add(notif)

        # 7. Audit logs
        print("Creating audit logs...")
        audits_data = [
            {"user_id": admin.id, "action": "system_bootstrap", "ip_address": "127.0.0.1", "details": {"version": "1.0.0"}},
            {"user_id": patients[0].user_id, "action": "user_register", "ip_address": "192.168.1.44", "details": {"email": patients[0].user.email}},
            {"user_id": doctors[0].user_id, "action": "user_register", "ip_address": "192.168.1.12", "details": {"email": doctors[0].user.email}}
        ]
        for a in audits_data:
            audit = models.AuditLog(**a)
            db.add(audit)

        db.commit()
        print("Medicore Database Seed Completed Successfully!")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
