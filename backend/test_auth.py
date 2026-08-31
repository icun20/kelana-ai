import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app
from models import Trip, User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_kelana_ai.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

Base.metadata.create_all(bind=engine)


class AuthOwnershipTest(unittest.TestCase):
    def setUp(self):
        db = TestingSessionLocal()
        db.query(Trip).delete()
        db.query(User).delete()
        db.commit()
        db.close()

    def test_register_login_and_trip_ownership(self):
        client = TestClient(app)

        register_response = client.post(
            "/api/v1/auth/register",
            json={"name": "Adit", "email": "adit@example.com", "password": "secret123"},
        )
        self.assertEqual(register_response.status_code, 200)
        data = register_response.json()
        self.assertIn("token", data)

        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "adit@example.com", "password": "secret123"},
        )
        self.assertEqual(login_response.status_code, 200)
        token = login_response.json()["token"]

        create_response = client.post(
            "/api/v1/trips",
            json={"destination": "Tokyo", "days": 4, "budget": 1500},
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(create_response.status_code, 200)
        trip_id = create_response.json()["id"]

        list_response = client.get(
            "/api/v1/trips",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        other_register = client.post(
            "/api/v1/auth/register",
            json={"name": "Budi", "email": "budi@example.com", "password": "secret123"},
        )
        other_token = other_register.json()["token"]

        update_response = client.put(
            f"/api/v1/trips/{trip_id}",
            json={"budget": 2000},
            headers={"Authorization": f"Bearer {other_token}"},
        )
        self.assertEqual(update_response.status_code, 403)

        delete_response = client.delete(
            f"/api/v1/trips/{trip_id}",
            headers={"Authorization": f"Bearer {other_token}"},
        )
        self.assertEqual(delete_response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
