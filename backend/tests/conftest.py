# conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.dependencies import get_db
from backend.database.schema import Base
from fastapi.testclient import TestClient
from backend.main import app
from backend.Seed_Database import load_dummy_data

TEST_DB_URL = "sqlite:///:memory:"

engine_test = create_engine(TEST_DB_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine_test)
    session = TestingSessionLocal()
    load_dummy_data(session)
    session.close()
    yield
    Base.metadata.drop_all(bind=engine_test)

@pytest.fixture
def override_get_db():
    def _override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def client(override_get_db):
    return TestClient(app)
