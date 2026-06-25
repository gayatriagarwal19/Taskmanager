import pytest
from fastapi.testclient import TestClient
from pathlib import Path

# Ensure the project root is on PYTHONPATH for imports and set test flag
import os
os.environ["PYTEST_RUNNING"] = "1"
import sys
sys.path.append(str(Path(__file__).resolve().parents[2]))

from backend.app.main import app
from backend.app import models, database
from backend.app.database import get_db, engine

client = TestClient(app)

# Helper to reset the database before each test run
@pytest.fixture(autouse=True)
def reset_db():
    # Drop all tables and recreate – safe for a test database
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    yield
    # No teardown needed – each test gets a fresh DB

def test_signup_and_login():
    # --- Signup (create a user) ---
    signup_resp = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "Secret123!"},
    )
    assert signup_resp.status_code == 201, signup_resp.text
    data = signup_resp.json()
    assert "access_token" in data
    token = data["access_token"]

    # --- Login ---
    login_resp = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "Secret123!"},
    )
    assert login_resp.status_code == 200, login_resp.text
    login_data = login_resp.json()
    assert login_data["access_token"] == token

def test_task_crud_flow():
    # Create a user first and obtain token
    signup_resp = client.post(
        "/auth/register",
        json={"email": "bob@example.com", "password": "Pass123!"},
    )
    token = signup_resp.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create a task
    task_payload = {"title": "Write tests", "description": "Add pytest suite", "priority": 2}
    create_resp = client.post("/tasks/", json=task_payload, headers=auth_headers)
    assert create_resp.status_code == 201, create_resp.text
    task = create_resp.json()
    task_id = task["id"]

    # Retrieve the task
    get_resp = client.get(f"/tasks/{task_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Write tests"

    # Update the task status
    update_resp = client.patch(
        f"/tasks/{task_id}",
        json={"status": "in_progress"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "in_progress"

    # Delete the task
    del_resp = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert del_resp.status_code == 204
    # Confirm deletion
    confirm_resp = client.get(f"/tasks/{task_id}", headers=auth_headers)
    assert confirm_resp.status_code == 404
