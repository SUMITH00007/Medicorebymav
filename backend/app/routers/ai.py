from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import random
from app.core import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

# High-fidelity keyword dictionaries for AI Symptom Checker
SYMPTOM_DB = [
    {
        "keywords": ["chest pain", "shortness of breath", "heart racing", "palpitations"],
        "possible_diagnoses": ["Angina Pectoris", "Arrhythmia", "Myocardial Infarction warning", "Anxiety Disorder"],
        "recommended_specialists": ["Cardiologist", "Emergency Medicine Specialist"],
        "urgency_level": "Emergency"
    },
    {
        "keywords": ["headache", "migraine", "blurry vision", "dizziness"],
        "possible_diagnoses": ["Migraine headache", "Tension headache", "Hypertensive crisis", "Sinusitis"],
        "recommended_specialists": ["Neurologist", "General Practitioner"],
        "urgency_level": "High"
    },
    {
        "keywords": ["cough", "fever", "sore throat", "runny nose", "congestion"],
        "possible_diagnoses": ["Influenza (Flu)", "Acute Bronchitis", "Common Cold", "COVID-19"],
        "recommended_specialists": ["General Practitioner", "Pulmonologist"],
        "urgency_level": "Medium"
    },
    {
        "keywords": ["stomach pain", "nausea", "diarrhea", "indigestion", "bloating"],
        "possible_diagnoses": ["Gastroenteritis (Stomach Flu)", "Acid Reflux (GERD)", "Food Intolerance", "Irritable Bowel Syndrome"],
        "recommended_specialists": ["Gastroenterologist", "Dietitian"],
        "urgency_level": "Medium"
    },
    {
        "keywords": ["rash", "itching", "red skin", "hives", "eczema"],
        "possible_diagnoses": ["Contact Dermatitis", "Eczema flare-up", "Urticaria (Hives)", "Allergic reaction"],
        "recommended_specialists": ["Dermatologist", "Allergist"],
        "urgency_level": "Low"
    }
]

@router.post("/symptom-checker", response_model=schemas.SymptomCheckResponse)
def analyze_symptoms(request: schemas.SymptomCheckRequest):
    symptom_text = request.symptoms.lower()
    
    # Matching process
    matched_entry = None
    for entry in SYMPTOM_DB:
        for kw in entry["keywords"]:
            if kw in symptom_text:
                matched_entry = entry
                break
        if matched_entry:
            break
            
    if matched_entry:
        return schemas.SymptomCheckResponse(
            analysis=(
                f"Based on your symptoms, we identified high correspondence with respiratory/organ system indicators. "
                f"We strongly recommend consulting a professional in {matched_entry['recommended_specialists'][0]}."
            ),
            possible_diagnoses=matched_entry["possible_diagnoses"],
            recommended_specialists=matched_entry["recommended_specialists"],
            urgency_level=matched_entry["urgency_level"]
        )
    
    # Generic fallback
    return schemas.SymptomCheckResponse(
        analysis="Your symptoms appear mild or general. We suggest resting, drinking fluids, and consulting a physician if symptoms persist.",
        possible_diagnoses=["General Fatigue", "Mild immune reaction", "Somatic response"],
        recommended_specialists=["General Practitioner"],
        urgency_level="Low"
    )

@router.post("/chatbot", response_model=schemas.ChatResponse)
def chat_assistant(request: schemas.ChatRequest):
    user_msg = request.message.lower()
    
    # Conversational triage matching
    reply = "I am Medicore's Virtual Assistant. I can help triage symptoms or schedule visits. Please describe your symptoms or state if you wish to book an appointment."
    spec = None
    
    if "book" in user_msg or "appointment" in user_msg or "doctor" in user_msg:
        reply = "I can guide you to our Scheduling department! Please navigate to the 'Book Appointment' page, select your preferred specialist, and reserve a calendar slot."
    elif "chest" in user_msg or "heart" in user_msg:
        reply = "WARNING: Chest tightness or breathing difficulties could indicate an emergency. Please dial emergency services or visit the nearest ER immediately."
        spec = "Cardiology"
    elif "skin" in user_msg or "rash" in user_msg or "itch" in user_msg:
        reply = "This sounds like it could be a dermatological concern. Keep the area clean and avoid scratching. I recommend scheduling an appointment with a Dermatologist."
        spec = "Dermatology"
    elif "head" in user_msg or "migraine" in user_msg:
        reply = "Migraines can be triggered by stress, dehydration, or sleep deprivation. Try resting in a quiet, dark room and keeping hydrated. A neurologist can help if these persist."
        spec = "Neurology"
    elif "hi" in user_msg or "hello" in user_msg:
        reply = "Hello! I am Medicore's medical AI advisor. How can I help you today? Please tell me how you are feeling."

    return schemas.ChatResponse(
        reply=reply,
        recommended_specialty=spec
    )

@router.get("/insights")
def get_health_insights(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="Only patients have health metrics tracking")
        
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    
    # Mock some clinical telemetry metrics (water, steps, sleep, blood pressure trends)
    insights = {
        "daily_steps": 7820,
        "steps_target": 10000,
        "sleep_hours": 7.2,
        "hydration_ml": 1850,
        "hydration_target": 2500,
        "bp_systolic": 118,
        "bp_diastolic": 76,
        "blood_sugar": 92,
        "status_messages": [
            "Your Hydration is 74% of target. Try to drink 2 more glasses of water.",
            "Great job! Your blood pressure is in the optimal range (118/76 mmHg).",
            "Your step count is 80% towards your daily goal."
        ],
        "history_trends": [
            {"day": "Mon", "steps": 6200, "sleep": 6.8},
            {"day": "Tue", "steps": 8100, "sleep": 7.5},
            {"day": "Wed", "steps": 7400, "sleep": 7.0},
            {"day": "Thu", "steps": 9300, "sleep": 8.0},
            {"day": "Fri", "steps": 7820, "sleep": 7.2}
        ]
    }
    return insights
