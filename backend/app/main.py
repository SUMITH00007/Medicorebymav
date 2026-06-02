from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.routers import auth, patients, doctors, appointments, payments, ai, admin

# Proactively construct database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# CORS Policy Configs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open to facilitate Next.js multi-origin client requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tie routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(patients.router, prefix=f"{settings.API_V1_STR}/patients", tags=["patients"])
app.include_router(doctors.router, prefix=f"{settings.API_V1_STR}/doctors", tags=["doctors"])
app.include_router(appointments.router, prefix=f"{settings.API_V1_STR}/appointments", tags=["appointments"])
app.include_router(payments.router, prefix=f"{settings.API_V1_STR}/payments", tags=["payments"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Medicore Healthcare Engine",
        "documentation": "/docs"
    }
