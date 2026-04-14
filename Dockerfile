# ── Stage 1: build del frontend ───────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# ── Stage 2: backend + static ─────────────────────────────────
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# El build del frontend queda en /app/static
COPY --from=frontend-builder /app/dist ./static

RUN mkdir -p /app/data

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
