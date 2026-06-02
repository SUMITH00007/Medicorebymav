FROM python:3.10-slim

WORKDIR /workspace

# Install system dependencies needed for compiling psycopg2 and general utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Script to verify tables, seed data, and start uvicorn
CMD python seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000
