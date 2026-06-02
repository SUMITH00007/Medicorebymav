# CareSync | Production-Grade Healthcare Management Platform

CareSync is a premium, HIPAA & ISO-27001 security-compliant Healthcare SaaS Management monorepo. It features visual circular telemetry wheels, dynamic appointment booking checkout, ReportLab prescription PDF generators, clinical NLP checkers, WebRTC virtual consulting, and immutable access logs.

---

## Technical Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Lucide Icons, and Recharts.
- **Backend**: FastAPI (Python), SQLAlchemy ORM (thread-safe operations), and ReportLab PDF layout generator.
- **Database**: PostgreSQL (Production) / SQLite (Local Fallback for instant run-ability).
- **Orchestration**: Docker & Docker Compose.

---

## Monorepo Project Layout
```
caresync/
├── backend/
│   ├── app/
│   │   ├── core/           # Database configurations, JWT checkers, and authorization dependencies
│   │   ├── models/         # SQLAlchemy Relational Models (12 tables)
│   │   ├── schemas/        # Pydantic schemas validating all API payloads
│   │   ├── routers/        # Modular APIs (Auth, Patients, Doctors, Admin, AI, Checkout)
│   │   ├── services/       # PDF builders and WebRTC Signaller simulations
│   │   └── main.py         # App bootstrap & CORS policies
│   ├── seed.py             # Pre-populates tables with patient medical profiles and history
│   ├── requirements.txt    # Python dependencies list
│   └── Dockerfile          # Production Uvicorn image
├── frontend/
│   ├── src/
│   │   └── app/            # Next.js 15 pages (Landing page, Patient, Doctor, Admin Dashboards)
│   ├── package.json        # Frontend Node modules configuration
│   ├── tailwind.config.ts  # Visual HSL variables & dark mode setups
│   └── Dockerfile          # Multi-stage optimized Next.js package image
└── docker-compose.yml       # Standard Postgres, FastAPI, and Node orchestration
```

---

## 1. Quick Start with Docker Compose (Recommended)
To boot all three services (PostgreSQL, FastAPI, Next.js) simultaneously:
1. Ensure Docker Desktop is active on your host system.
2. In the root `caresync/` directory, execute:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the portals at:
   - **Frontend SaaS Landing Page**: [http://localhost:3000](http://localhost:3000)
   - **Interactive Patient Portal**: [http://localhost:3000/patient](http://localhost:3000/patient)
   - **Practitioner Doctor Dashboard**: [http://localhost:3000/doctor](http://localhost:3000/doctor)
   - **Administrative Audit Suite**: [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Swagger FastAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 2. Running Locally (Development Mode)
To run without Docker using the built-in SQLite automatic database fallback:

### A. Run Backend API
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment, then install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the database seeder to create `caresync.db` and insert initial data:
   ```bash
   python seed.py
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### B. Run Frontend UI
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. Use the top navigation bar or the floating theme controls to test dark mode and the integrated clinical chatbots.
