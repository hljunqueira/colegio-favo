"""
Backend tests for Centro Educacional Favo de Mel API.
Covers: /api/leads (public), /api/auth/login, /api/auth/me,
        /api/admin/leads (list + patch), /api/avisos (list/post/delete),
        /api/portal/dashboard, /api/gestao/* (stats, alunos, turmas,
        professores, financeiro, responsaveis, usuarios).
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://favo-portal.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@favodemel.com.br"
ADMIN_PASSWORD = "Favo@2025"
RESP_EMAIL = "responsavel@favodemel.com.br"
RESP_PASSWORD = "Favo@2025"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["token"]
    return data["token"]


@pytest.fixture(scope="session")
def resp_token(api_client):
    r = api_client.post(f"{API}/auth/login", json={"email": RESP_EMAIL, "password": RESP_PASSWORD})
    assert r.status_code == 200, f"responsavel login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="session")
def resp_headers(resp_token):
    return {"Authorization": f"Bearer {resp_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Public leads ----------
class TestLeadsPublic:
    def test_create_lead_returns_expected_shape(self, api_client):
        unique = uuid.uuid4().hex[:8]
        payload = {
            "parent_name": f"TEST Parent {unique}",
            "email": f"test_{unique}@example.com",
            "phone": "(48) 99627-5127",
            "child_name": "TEST Child",
            "program": "Maternal",
            "message": "TEST message from pytest",
        }
        r = api_client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["status"] == "novo"
        assert "created_at" in data
        assert data["parent_name"] == payload["parent_name"]

    def test_create_lead_invalid_email(self, api_client):
        r = api_client.post(f"{API}/leads", json={
            "parent_name": "TEST bad", "email": "not-an-email", "phone": "1234"
        })
        assert r.status_code == 422


# ---------- Auth ----------
class TestAuth:
    def test_login_admin_success(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["role"] == "admin"

    def test_login_responsavel_success(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": RESP_EMAIL, "password": RESP_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["role"] == "responsavel"
        assert data["user"]["email"] == RESP_EMAIL

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG_PASS"})
        assert r.status_code == 401

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_admin_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["role"] == "admin"


# ---------- Admin leads (regression) ----------
class TestAdminLeads:
    def test_list_leads_requires_auth(self):
        r = requests.get(f"{API}/admin/leads")
        assert r.status_code == 401

    def test_list_and_patch_lead(self, api_client, auth_headers):
        unique = uuid.uuid4().hex[:8]
        cr = api_client.post(f"{API}/leads", json={
            "parent_name": f"TEST Patch {unique}",
            "email": f"patch_{unique}@example.com",
            "phone": "48999999999",
        })
        assert cr.status_code == 200
        lead_id = cr.json()["id"]

        r = requests.patch(f"{API}/admin/leads/{lead_id}",
                           json={"status": "em contato"}, headers=auth_headers)
        assert r.status_code == 200

        lr = requests.get(f"{API}/admin/leads", headers=auth_headers)
        target = next((l for l in lr.json() if l["id"] == lead_id), None)
        assert target is not None
        assert target["status"] == "em contato"


# ---------- Avisos (comunicados) ----------
class TestAvisos:
    def test_list_avisos_requires_auth(self):
        r = requests.get(f"{API}/avisos")
        assert r.status_code == 401

    def test_create_list_delete_aviso(self, auth_headers):
        payload = {"titulo": "TEST Aviso", "texto": "Conteudo do teste", "categoria": "Geral"}
        cr = requests.post(f"{API}/avisos", json=payload, headers=auth_headers)
        assert cr.status_code == 200, cr.text
        av = cr.json()
        assert av["titulo"] == payload["titulo"]
        assert "id" in av
        aviso_id = av["id"]

        # Listed
        lr = requests.get(f"{API}/avisos", headers=auth_headers)
        assert lr.status_code == 200
        assert any(a["id"] == aviso_id for a in lr.json())

        # Delete
        dr = requests.delete(f"{API}/avisos/{aviso_id}", headers=auth_headers)
        assert dr.status_code == 200

        lr2 = requests.get(f"{API}/avisos", headers=auth_headers)
        assert not any(a["id"] == aviso_id for a in lr2.json())


# ---------- Portal (responsavel role guard) ----------
class TestPortalDashboard:
    def test_portal_requires_auth(self):
        r = requests.get(f"{API}/portal/dashboard")
        assert r.status_code == 401

    def test_portal_responsavel_ok(self, resp_headers):
        r = requests.get(f"{API}/portal/dashboard", headers=resp_headers)
        assert r.status_code == 200
        data = r.json()
        assert "student" in data and data["student"] is not None
        assert data["student"]["name"] == "Miguel Souza"
        assert isinstance(data["student"].get("boletim"), list) and len(data["student"]["boletim"]) >= 1
        assert isinstance(data["student"].get("financeiro"), list)
        assert isinstance(data["student"].get("agenda"), list)
        assert isinstance(data["student"].get("cardapio"), list)
        assert isinstance(data.get("avisos"), list)

    def test_portal_admin_can_access(self, auth_headers):
        # admin also has access per require_responsavel
        r = requests.get(f"{API}/portal/dashboard", headers=auth_headers)
        assert r.status_code == 200


# ---------- Gestão / ERP ----------
class TestGestaoAuthGuard:
    def test_gestao_stats_requires_auth(self):
        r = requests.get(f"{API}/gestao/stats")
        assert r.status_code == 401

    def test_gestao_stats_denies_responsavel(self, resp_headers):
        r = requests.get(f"{API}/gestao/stats", headers=resp_headers)
        assert r.status_code == 403

    def test_gestao_alunos_denies_responsavel(self, resp_headers):
        r = requests.get(f"{API}/gestao/alunos", headers=resp_headers)
        assert r.status_code == 403


class TestGestaoStats:
    def test_stats_shape(self, auth_headers):
        r = requests.get(f"{API}/gestao/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("alunos", "turmas", "professores", "contatos_novos", "comunicados", "mensalidades_abertas"):
            assert k in d
        assert isinstance(d["alunos"], int)
        assert isinstance(d["mensalidades_abertas"], (int, float))


class TestGestaoAlunos:
    def test_list_and_create_aluno(self, auth_headers):
        unique = uuid.uuid4().hex[:6]
        payload = {"name": f"TEST Aluno {unique}", "turma": "3º ano", "matricula": f"TST-{unique}"}
        cr = requests.post(f"{API}/gestao/alunos", json=payload, headers=auth_headers)
        assert cr.status_code == 200, cr.text
        created = cr.json()
        assert created["name"] == payload["name"]
        assert "id" in created and created["id"]
        aid = created["id"]

        lr = requests.get(f"{API}/gestao/alunos", headers=auth_headers)
        assert lr.status_code == 200
        rows = lr.json()
        assert any(a["id"] == aid for a in rows)

        # Search by name
        sr = requests.get(f"{API}/gestao/alunos", params={"q": f"TEST Aluno {unique}"}, headers=auth_headers)
        assert sr.status_code == 200
        assert any(a["id"] == aid for a in sr.json())

        # Get by id
        gr = requests.get(f"{API}/gestao/alunos/{aid}", headers=auth_headers)
        assert gr.status_code == 200
        assert gr.json()["name"] == payload["name"]

        # Patch status
        pr = requests.patch(f"{API}/gestao/alunos/{aid}", json={"status": "arquivada"}, headers=auth_headers)
        assert pr.status_code == 200

    def test_get_unknown_aluno_404(self, auth_headers):
        r = requests.get(f"{API}/gestao/alunos/does-not-exist", headers=auth_headers)
        assert r.status_code == 404


class TestGestaoTurmas:
    def test_list_and_create_turma(self, auth_headers):
        lr = requests.get(f"{API}/gestao/turmas", headers=auth_headers)
        assert lr.status_code == 200
        assert isinstance(lr.json(), list)

        unique = uuid.uuid4().hex[:6]
        payload = {"nome": f"TEST Turma {unique}", "serie": "Fundamental I",
                   "turno": "Vespertino", "ano": "2025", "professor": "TEST Prof"}
        cr = requests.post(f"{API}/gestao/turmas", json=payload, headers=auth_headers)
        assert cr.status_code == 200
        assert cr.json()["nome"] == payload["nome"]


class TestGestaoProfessores:
    def test_list_and_create_professor(self, auth_headers):
        lr = requests.get(f"{API}/gestao/professores", headers=auth_headers)
        assert lr.status_code == 200
        assert isinstance(lr.json(), list)

        unique = uuid.uuid4().hex[:6]
        payload = {"name": f"TEST Prof {unique}", "email": f"prof_{unique}@t.com",
                   "disciplina": "Artes", "telefone": "48999998888"}
        cr = requests.post(f"{API}/gestao/professores", json=payload, headers=auth_headers)
        assert cr.status_code == 200
        assert cr.json()["name"] == payload["name"]


class TestGestaoReadOnly:
    def test_financeiro(self, auth_headers):
        r = requests.get(f"{API}/gestao/financeiro", headers=auth_headers)
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        if rows:
            row = rows[0]
            for k in ("aluno", "ref", "valor", "status"):
                assert k in row

    def test_responsaveis(self, auth_headers):
        r = requests.get(f"{API}/gestao/responsaveis", headers=auth_headers)
        assert r.status_code == 200
        rows = r.json()
        assert any(u["email"] == RESP_EMAIL for u in rows)

    def test_usuarios(self, auth_headers):
        r = requests.get(f"{API}/gestao/usuarios", headers=auth_headers)
        assert r.status_code == 200
        emails = [u["email"] for u in r.json()]
        assert ADMIN_EMAIL in emails
        assert RESP_EMAIL in emails
        # never leak password hash
        for u in r.json():
            assert "password_hash" not in u
