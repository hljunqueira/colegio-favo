"""
Backend tests for Centro Educacional Favo de Mel API.
Covers: /api/leads (public), /api/auth/login, /api/auth/me,
        /api/admin/leads (list + patch)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://favo-portal.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@favodemel.com.br"
ADMIN_PASSWORD = "Favo@2025"


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
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


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
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["program"] == payload["program"]

    def test_create_lead_minimal_fields(self, api_client):
        unique = uuid.uuid4().hex[:8]
        payload = {
            "parent_name": f"TEST Min {unique}",
            "email": f"min_{unique}@example.com",
            "phone": "48999999999",
        }
        r = api_client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "novo"
        assert data["child_name"] == ""
        assert data["program"] == ""

    def test_create_lead_invalid_email(self, api_client):
        r = api_client.post(f"{API}/leads", json={
            "parent_name": "TEST bad",
            "email": "not-an-email",
            "phone": "1234"
        })
        assert r.status_code == 422


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"].get("role") == "admin"

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG_PASS"})
        assert r.status_code == 401

    def test_login_wrong_email(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": "nobody@example.com", "password": "whatever"})
        assert r.status_code == 401

    def test_me_without_token(self, api_client):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, api_client, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data.get("role") == "admin"

    def test_me_with_invalid_token(self, api_client):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer notarealtoken"})
        assert r.status_code == 401


# ---------- Admin leads ----------
class TestAdminLeads:
    def test_list_leads_requires_auth(self):
        r = requests.get(f"{API}/admin/leads")
        assert r.status_code == 401

    def test_list_leads_ok_sorted_newest_first(self, api_client, auth_headers):
        # Create a marker lead
        unique = uuid.uuid4().hex[:8]
        payload = {
            "parent_name": f"TEST Sort {unique}",
            "email": f"sort_{unique}@example.com",
            "phone": "48999999999",
        }
        cr = api_client.post(f"{API}/leads", json=payload)
        assert cr.status_code == 200
        lead_id = cr.json()["id"]

        r = requests.get(f"{API}/admin/leads", headers=auth_headers)
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list)
        assert len(leads) >= 1
        # Marker must appear
        ids = [l["id"] for l in leads]
        assert lead_id in ids
        # Sorted newest first
        created_dates = [l["created_at"] for l in leads]
        assert created_dates == sorted(created_dates, reverse=True), "leads not sorted newest first"
        # First entry (just created) should be our lead
        assert leads[0]["id"] == lead_id

    def test_patch_lead_status(self, api_client, auth_headers):
        unique = uuid.uuid4().hex[:8]
        cr = api_client.post(f"{API}/leads", json={
            "parent_name": f"TEST Patch {unique}",
            "email": f"patch_{unique}@example.com",
            "phone": "48999999999",
        })
        assert cr.status_code == 200
        lead_id = cr.json()["id"]

        r = requests.patch(f"{API}/admin/leads/{lead_id}", json={"status": "em contato"}, headers=auth_headers)
        assert r.status_code == 200
        assert r.json().get("ok") is True

        # Verify persisted
        lr = requests.get(f"{API}/admin/leads", headers=auth_headers)
        assert lr.status_code == 200
        target = next((l for l in lr.json() if l["id"] == lead_id), None)
        assert target is not None
        assert target["status"] == "em contato"

    def test_patch_lead_requires_auth(self):
        r = requests.patch(f"{API}/admin/leads/does-not-matter", json={"status": "novo"})
        assert r.status_code == 401
