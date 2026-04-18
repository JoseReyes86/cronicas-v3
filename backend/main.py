import json
import os
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from database import get_db, init_db

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key_CHANGE_IN_PRODUCTION")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24   # sesión de 1 día

app = FastAPI(title="Crónica API v2")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer()


@app.on_event("startup")
def startup():
    init_db()


# ── Fórmula: Capacidad de Carga ───────────────────────────────────────────────
# Base 20 pts (casilla 1 siempre marcada). Cada atributo con val >= 3 suma
# 10 pts y marca 1 casilla adicional. Máximo 8 casillas (StatDiamond max=8).
def compute_capacidad_carga(data: dict) -> int:
    atributos = data.get("atributos", {})
    n = sum(1 for stat in atributos.values() if isinstance(stat, dict) and bin(stat.get("val", 0)).count('1') >= 3)
    boxes = min(1 + n, 10)
    return (1 << boxes) - 1


# ── Auth helpers ──────────────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def create_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, ALGORITHM)


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")


# ── Auth verify ───────────────────────────────────────────────────────────────
@app.get("/auth/verify")
def verify_token(user_id: int = Depends(get_current_user)):
    """Valida que el token sea vigente. El frontend lo llama al montar."""
    return {"user_id": user_id, "valid": True}


# ── Schemas ───────────────────────────────────────────────────────────────────
class AuthRequest(BaseModel):
    username: str
    password: str


class CharacterRequest(BaseModel):
    name: str
    data: dict


# ── Auth endpoints ────────────────────────────────────────────────────────────
@app.post("/auth/register")
def register(req: AuthRequest):
    db = get_db()
    if db.execute("SELECT id FROM users WHERE username = ?", (req.username,)).fetchone():
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    db.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (req.username, hash_password(req.password))
    )
    db.commit()
    user = db.execute("SELECT id FROM users WHERE username = ?", (req.username,)).fetchone()
    db.close()
    return {"token": create_token(user["id"])}


@app.post("/auth/login")
def login(req: AuthRequest):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (req.username,)).fetchone()
    db.close()
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {"token": create_token(user["id"])}


# ── Character endpoints ───────────────────────────────────────────────────────
@app.get("/api/characters")
def list_characters(user_id: int = Depends(get_current_user)):
    db = get_db()
    rows = db.execute(
        "SELECT id, name, data, created_at, updated_at FROM characters WHERE user_id = ? ORDER BY updated_at DESC",
        (user_id,)
    ).fetchall()
    db.close()
    return [{"id": r["id"], "name": r["name"], "data": json.loads(r["data"]),
             "created_at": r["created_at"], "updated_at": r["updated_at"]} for r in rows]


@app.post("/api/characters", status_code=201)
def create_character(req: CharacterRequest, user_id: int = Depends(get_current_user)):
    data = req.data
    data["capacidadCarga"] = compute_capacidad_carga(data)
    db = get_db()
    cur = db.execute(
        "INSERT INTO characters (user_id, name, data) VALUES (?, ?, ?)",
        (user_id, req.name, json.dumps(data))
    )
    db.commit()
    row = db.execute("SELECT id, name, data, created_at, updated_at FROM characters WHERE id = ?", (cur.lastrowid,)).fetchone()
    db.close()
    return {"id": row["id"], "name": row["name"], "data": json.loads(row["data"]),
            "created_at": row["created_at"], "updated_at": row["updated_at"]}


@app.put("/api/characters/{char_id}")
def update_character(char_id: int, req: CharacterRequest, user_id: int = Depends(get_current_user)):
    data = req.data
    data["capacidadCarga"] = compute_capacidad_carga(data)
    db = get_db()
    row = db.execute("SELECT id FROM characters WHERE id = ? AND user_id = ?", (char_id, user_id)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    db.execute(
        "UPDATE characters SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?",
        (req.name, json.dumps(data), char_id)
    )
    db.commit()
    row = db.execute("SELECT id, name, data, created_at, updated_at FROM characters WHERE id = ?", (char_id,)).fetchone()
    db.close()
    return {"id": row["id"], "name": row["name"], "data": json.loads(row["data"]),
            "created_at": row["created_at"], "updated_at": row["updated_at"]}


@app.delete("/api/characters/{char_id}", status_code=204)
def delete_character(char_id: int, user_id: int = Depends(get_current_user)):
    db = get_db()
    row = db.execute("SELECT id FROM characters WHERE id = ? AND user_id = ?", (char_id, user_id)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    db.execute("DELETE FROM characters WHERE id = ?", (char_id,))
    db.commit()
    db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ── Frontend estático ─────────────────────────────────────────────────────────
# Se monta al final para que las rutas /api/* y /auth/* tengan prioridad.
# StaticFiles con html=True hace fallback a index.html (necesario para React Router).
_static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(_static_dir):
    app.mount("/", StaticFiles(directory=_static_dir, html=True), name="static")
