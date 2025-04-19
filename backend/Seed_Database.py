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

        for e in data.get("enrolled", []):
            db.add(DBEnrolled(**e))

        db.commit()
        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error while populating database: {e}")

    finally:
        db.close()
