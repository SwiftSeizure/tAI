import json
import os
from sqlalchemy.orm import Session
from backend.database.schema import (
    DBStudent, DBTeacher, DBClass, DBEnrolled,
    DBUnit, DBModule, DBDay, DBAssignment, DBMaterial,
    Base
)
from backend.dependencies import engine, SessionLocal


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_FILE_PATH = os.path.join(BASE_DIR, "seed_data.json")
TEST_FILE_PATH = os.path.join(BASE_DIR, "test_data.json")

Base.metadata.drop_all(bind=engine)   
Base.metadata.create_all(bind=engine)

def PopulateDB(file: str = SEED_FILE_PATH): 
    Base.metadata.create_all(bind=engine)
    print("Populating database...")

    db: Session = SessionLocal()

    try:
        with open(file, "r") as f:
            data = json.load(f)

        # Clear existing data (respect foreign key constraints)
        db.query(DBMaterial).delete()
        db.query(DBAssignment).delete()
        db.query(DBDay).delete()
        db.query(DBModule).delete()
        db.query(DBUnit).delete()
        db.query(DBEnrolled).delete()
        db.query(DBClass).delete()
        db.query(DBStudent).delete()
        db.query(DBTeacher).delete()
        db.commit()

        # Insert in dependency-safe order
        for t in data.get("teacher", []):
            db.add(DBTeacher(**t))

        for s in data.get("student", []):
            db.add(DBStudent(**s))

        for c in data.get("class", []):
            db.add(DBClass(**c))

        for e in data.get("enrolled", []): 
            db.add(DBEnrolled(**e))

        for u in data.get("unit", []):
            db.add(DBUnit(**u))

        for m in data.get("module", []):
            db.add(DBModule(**m))

        for d in data.get("day", []):
            db.add(DBDay(**d))

        for a in data.get("assignment", []):
            db.add(DBAssignment(**a))

        for m in data.get("material", []):
            db.add(DBMaterial(**m))

        db.commit()
        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error while populating database: {e}")

    finally:
        db.close()


def load_dummy_data(session: Session, json_path: str = TEST_FILE_PATH):
    with open(json_path) as f:
        data = json.load(f)

    for item in data["teachers"]:
        session.add(DBTeacher(**item))
    for item in data["students"]:
        session.add(DBStudent(**item))
    for item in data["classes"]:
        session.add(DBClass(**item))
    for item in data["enrollments"]:
        session.add(DBEnrolled(**item))
    for item in data["units"]:
        session.add(DBUnit(**item))
    for item in data["modules"]:
        session.add(DBModule(**item))
    for item in data["days"]:
        session.add(DBDay(**item))
    for item in data["assignments"]:
        session.add(DBAssignment(**item))
    for item in data["materials"]:
        session.add(DBMaterial(**item))

    session.commit()

