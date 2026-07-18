from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class LeadCreate(BaseModel):
    parent_name: str
    email: EmailStr
    phone: str
    child_name: Optional[str] = ""
    program: Optional[str] = ""
    message: Optional[str] = ""


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    parent_name: str
    email: str
    phone: str
    child_name: str = ""
    program: str = ""
    message: str = ""
    status: str = "novo"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginInput(BaseModel):
    email: EmailStr
    password: str


# ---------- Auth helper ----------
async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"email": payload.get("email")})
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return {"email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


async def require_responsavel(current=Depends(get_current_user)):
    if current.get("role") not in ("responsavel", "admin"):
        raise HTTPException(status_code=403, detail="Acesso restrito ao portal")
    return current


async def require_admin(current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso restrito à gestão")
    return current


# ---------- Gestão (ERP) models ----------
class AlunoCreate(BaseModel):
    name: str
    turma: str = ""
    matricula: str = ""
    responsavel_email: str = ""
    responsavel_nome: str = ""
    nascimento: str = ""


class TurmaCreate(BaseModel):
    nome: str
    serie: str = ""
    turno: str = "Matutino"
    ano: str = "2025"
    professor: str = ""


class ProfessorCreate(BaseModel):
    name: str
    email: str = ""
    disciplina: str = ""
    telefone: str = ""


class AvisoCreate(BaseModel):
    titulo: str
    texto: str
    categoria: str = "Geral"


class Aviso(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titulo: str
    texto: str
    categoria: str = "Geral"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"message": "Centro Educacional Favo de Mel API"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)
    return lead


# ---------- Auth routes ----------
@api_router.post("/auth/login")
async def login(payload: LoginInput):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")
    token = create_access_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", ""), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_user)):
    return current


# ---------- Admin routes ----------
@api_router.get("/admin/leads", response_model=List[Lead])
async def list_leads(current=Depends(get_current_user)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for l in leads:
        if isinstance(l.get("created_at"), str):
            l["created_at"] = datetime.fromisoformat(l["created_at"])
    return leads


@api_router.patch("/admin/leads/{lead_id}")
async def update_lead_status(lead_id: str, body: dict, current=Depends(get_current_user)):
    status = body.get("status", "novo")
    await db.leads.update_one({"id": lead_id}, {"$set": {"status": status}})
    return {"ok": True}


# ---------- Comunicados (avisos) ----------
@api_router.get("/avisos", response_model=List[Aviso])
async def list_avisos_admin(current=Depends(get_current_user)):
    avisos = await db.avisos.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for a in avisos:
        if isinstance(a.get("created_at"), str):
            a["created_at"] = datetime.fromisoformat(a["created_at"])
    return avisos


@api_router.post("/avisos", response_model=Aviso)
async def create_aviso(payload: AvisoCreate, current=Depends(get_current_user)):
    aviso = Aviso(**payload.model_dump())
    doc = aviso.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.avisos.insert_one(doc)
    return aviso


@api_router.delete("/avisos/{aviso_id}")
async def delete_aviso(aviso_id: str, current=Depends(get_current_user)):
    await db.avisos.delete_one({"id": aviso_id})
    return {"ok": True}


# ---------- Portal do Responsável ----------
@api_router.get("/portal/dashboard")
async def portal_dashboard(current=Depends(require_responsavel)):
    student = await db.students.find_one({"responsavel_email": current["email"]}, {"_id": 0})
    if not student:
        student = await db.students.find_one({}, {"_id": 0})
    avisos = await db.avisos.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    for a in avisos:
        if isinstance(a.get("created_at"), str):
            a["created_at"] = datetime.fromisoformat(a["created_at"]).isoformat()
    return {"student": student, "avisos": avisos}


# ---------- Gestão (ERP) endpoints ----------
@api_router.get("/gestao/stats")
async def gestao_stats(current=Depends(require_admin)):
    alunos = await db.students.count_documents({"status": {"$ne": "arquivada"}})
    turmas = await db.turmas.count_documents({})
    professores = await db.teachers.count_documents({})
    contatos_novos = await db.leads.count_documents({"status": "novo"})
    comunicados = await db.avisos.count_documents({})
    aberto = 0.0
    async for s in db.students.find({}, {"financeiro": 1}):
        for f in s.get("financeiro", []):
            if f.get("status") == "aberto":
                aberto += f.get("valor", 0)
    return {
        "alunos": alunos, "turmas": turmas, "professores": professores,
        "contatos_novos": contatos_novos, "comunicados": comunicados,
        "mensalidades_abertas": round(aberto, 2),
    }


@api_router.get("/gestao/alunos")
async def list_alunos(q: str = "", current=Depends(require_admin)):
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    alunos = await db.students.find(query, {"_id": 0}).to_list(1000)
    return [{
        "id": a.get("id"), "name": a.get("name"), "turma": a.get("turma", ""),
        "matricula": a.get("matricula", ""), "responsavel_nome": a.get("responsavel_nome", ""),
        "responsavel_email": a.get("responsavel_email", ""), "status": a.get("status", "ativa"),
    } for a in alunos]


@api_router.post("/gestao/alunos")
async def create_aluno(payload: AlunoCreate, current=Depends(require_admin)):
    doc = {
        "id": str(uuid.uuid4()), "status": "ativa",
        "boletim": [], "financeiro": [], "agenda": [], "cardapio": [],
        **payload.model_dump(),
    }
    await db.students.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/gestao/alunos/{aluno_id}")
async def get_aluno(aluno_id: str, current=Depends(require_admin)):
    a = await db.students.find_one({"id": aluno_id}, {"_id": 0})
    if not a:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return a


@api_router.patch("/gestao/alunos/{aluno_id}")
async def update_aluno(aluno_id: str, body: dict, current=Depends(require_admin)):
    allowed = {k: v for k, v in body.items() if k in ("name", "turma", "matricula", "responsavel_email", "responsavel_nome", "nascimento", "status")}
    res = await db.students.update_one({"id": aluno_id}, {"$set": allowed})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return {"ok": True}


@api_router.get("/gestao/turmas")
async def list_turmas(current=Depends(require_admin)):
    return await db.turmas.find({}, {"_id": 0}).to_list(500)


@api_router.post("/gestao/turmas")
async def create_turma(payload: TurmaCreate, current=Depends(require_admin)):
    doc = {"id": str(uuid.uuid4()), **payload.model_dump()}
    await db.turmas.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/gestao/professores")
async def list_professores(current=Depends(require_admin)):
    return await db.teachers.find({}, {"_id": 0}).to_list(500)


@api_router.post("/gestao/professores")
async def create_professor(payload: ProfessorCreate, current=Depends(require_admin)):
    doc = {"id": str(uuid.uuid4()), **payload.model_dump()}
    await db.teachers.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/gestao/financeiro")
async def gestao_financeiro(current=Depends(require_admin)):
    rows = []
    async for s in db.students.find({}, {"_id": 0, "name": 1, "financeiro": 1}):
        for f in s.get("financeiro", []):
            rows.append({"aluno": s.get("name"), **f})
    return rows


@api_router.get("/gestao/responsaveis")
async def list_responsaveis(current=Depends(require_admin)):
    users = await db.users.find({"role": "responsavel"}, {"_id": 0, "password_hash": 0}).to_list(500)
    return users


@api_router.get("/gestao/usuarios")
async def list_usuarios(current=Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(500)
    return users


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("id", unique=True)
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administração Favo de Mel",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    # Demo responsável account for the portal
    resp_email = "responsavel@favodemel.com.br"
    resp_pass = "Favo@2025"
    if await db.users.find_one({"email": resp_email}) is None:
        await db.users.insert_one({
            "email": resp_email,
            "password_hash": hash_password(resp_pass),
            "name": "Ana Beatriz Souza",
            "role": "responsavel",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Responsavel seeded: %s", resp_email)

    # Demo student linked to the responsável
    if await db.students.find_one({"responsavel_email": resp_email}) is None:
        await db.students.insert_one({
            "id": str(uuid.uuid4()),
            "responsavel_email": resp_email,
            "name": "Miguel Souza",
            "turma": "4º ano — Fundamental I",
            "matricula": "2025-0416",
            "boletim": [
                {"disciplina": "Português", "b1": 8.5, "b2": 9.0, "b3": 8.0, "b4": None},
                {"disciplina": "Matemática", "b1": 7.5, "b2": 8.5, "b3": 9.0, "b4": None},
                {"disciplina": "Ciências", "b1": 9.0, "b2": 9.5, "b3": 8.5, "b4": None},
                {"disciplina": "História", "b1": 8.0, "b2": 7.5, "b3": 8.0, "b4": None},
                {"disciplina": "Geografia", "b1": 8.5, "b2": 8.0, "b3": 9.0, "b4": None},
                {"disciplina": "Inglês", "b1": 9.5, "b2": 9.0, "b3": 9.5, "b4": None},
            ],
            "financeiro": [
                {"ref": "Mensalidade Set/2025", "valor": 890.0, "vencimento": "2025-09-10", "status": "pago"},
                {"ref": "Mensalidade Out/2025", "valor": 890.0, "vencimento": "2025-10-10", "status": "pago"},
                {"ref": "Mensalidade Nov/2025", "valor": 890.0, "vencimento": "2025-11-10", "status": "aberto"},
                {"ref": "Material didático", "valor": 320.0, "vencimento": "2025-11-20", "status": "aberto"},
            ],
            "agenda": [
                {"date": "2025-11-12", "title": "Avaliação de Matemática — Frações", "type": "avaliacao", "disciplina": "Matemática"},
                {"date": "2025-11-14", "title": "Entrega do trabalho de Ciências", "type": "tarefa", "disciplina": "Ciências"},
                {"date": "2025-11-18", "title": "Reunião de pais e mestres — 19h", "type": "evento", "disciplina": "Geral"},
                {"date": "2025-11-20", "title": "Feira Cultural Favo de Mel", "type": "evento", "disciplina": "Geral"},
                {"date": "2025-11-25", "title": "Avaliação de Português — Interpretação", "type": "avaliacao", "disciplina": "Português"},
            ],
            "cardapio": [
                {"dia": "Segunda", "refeicao": "Arroz, feijão, frango grelhado e salada"},
                {"dia": "Terça", "refeicao": "Macarrão à bolonhesa e legumes"},
                {"dia": "Quarta", "refeicao": "Arroz, feijão, peixe assado e purê"},
                {"dia": "Quinta", "refeicao": "Sopa de legumes com carne e pão"},
                {"dia": "Sexta", "refeicao": "Arroz, feijão, almôndegas e salada de fruta"},
            ],
        })

    if await db.avisos.count_documents({}) == 0:
        base = datetime.now(timezone.utc)
        for i, a in enumerate([
            {"titulo": "Reunião de pais e mestres", "texto": "Convidamos todos os responsáveis para nossa reunião no dia 18/11 às 19h no auditório.", "categoria": "Evento"},
            {"titulo": "Feira Cultural Favo de Mel", "texto": "No dia 20/11 celebramos a criatividade das nossas crianças. Toda a família está convidada!", "categoria": "Evento"},
            {"titulo": "Semana da alimentação saudável", "texto": "Nesta semana teremos atividades especiais sobre hábitos saudáveis. Confira o novo cardápio.", "categoria": "Geral"},
        ]):
            await db.avisos.insert_one({
                "id": str(uuid.uuid4()),
                "created_at": (base - timedelta(days=i)).isoformat(),
                **a,
            })

    # Ensure demo student has ERP fields
    await db.students.update_many({"status": {"$exists": False}}, {"$set": {"status": "ativa", "responsavel_nome": "Ana Beatriz Souza"}})

    if await db.turmas.count_documents({}) == 0:
        for t in [
            {"nome": "Berçário A", "serie": "Berçário", "turno": "Integral", "ano": "2025", "professor": "Camila Rocha"},
            {"nome": "Maternal B", "serie": "Maternal", "turno": "Matutino", "ano": "2025", "professor": "Juliana Alves"},
            {"nome": "Infantil III", "serie": "Educação Infantil", "turno": "Vespertino", "ano": "2025", "professor": "Patrícia Lima"},
            {"nome": "4º ano", "serie": "Fundamental I", "turno": "Matutino", "ano": "2025", "professor": "Rafael Nunes"},
            {"nome": "8º ano", "serie": "Fundamental II", "turno": "Matutino", "ano": "2025", "professor": "Marcos Vieira"},
        ]:
            await db.turmas.insert_one({"id": str(uuid.uuid4()), **t})

    if await db.teachers.count_documents({}) == 0:
        for p in [
            {"name": "Camila Rocha", "email": "camila@favodemel.com.br", "disciplina": "Ed. Infantil", "telefone": "(48) 99999-0001"},
            {"name": "Rafael Nunes", "email": "rafael@favodemel.com.br", "disciplina": "Matemática", "telefone": "(48) 99999-0002"},
            {"name": "Patrícia Lima", "email": "patricia@favodemel.com.br", "disciplina": "Português", "telefone": "(48) 99999-0003"},
            {"name": "Marcos Vieira", "email": "marcos@favodemel.com.br", "disciplina": "Ciências", "telefone": "(48) 99999-0004"},
        ]:
            await db.teachers.insert_one({"id": str(uuid.uuid4()), **p})

    if await db.students.count_documents({}) < 4:
        for s in [
            {"name": "Helena Martins", "turma": "Maternal B", "matricula": "2025-0207", "responsavel_nome": "Carla Martins", "responsavel_email": ""},
            {"name": "Theo Ferreira", "turma": "Infantil III", "matricula": "2025-0311", "responsavel_nome": "Bruno Ferreira", "responsavel_email": ""},
            {"name": "Laura Gomes", "turma": "8º ano", "matricula": "2025-0815", "responsavel_nome": "Sandra Gomes", "responsavel_email": ""},
        ]:
            await db.students.insert_one({
                "id": str(uuid.uuid4()), "status": "ativa",
                "boletim": [], "agenda": [], "cardapio": [],
                "financeiro": [{"ref": "Mensalidade Nov/2025", "valor": 890.0, "vencimento": "2025-11-10", "status": "aberto"}],
                **s,
            })


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
