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

def InitializeDB():
    """Initialize database tables without seeding data"""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

def PopulateDB(file: str = SEED_FILE_PATH): 
    # Drop and recreate database schema only when explicitly called
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Populating database...")

    db: Session = SessionLocal()

    try:
        print("Reading seed data from:", file)
        with open(file, "r") as f:
            data = json.load(f)

        # Clear existing data (respect foreign key constraints)
        print("Clearing existing data...")
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
        print("Existing data cleared.")

        # Insert in dependency-safe order
        print("Adding teachers...")
        for t in data.get("teacher", []):
            try:
                print(f"Adding teacher with ID: {t.get('id')}")
                db.add(DBTeacher(**t))
                db.flush()  # Flush after each teacher to catch any errors immediately
            except Exception as e:
                print(f"Error adding teacher {t.get('id')}: {str(e)}")
                raise

        print("Adding students...")
        for s in data.get("student", []):
            try:
                print(f"Adding student with ID: {s.get('id')}")
                db.add(DBStudent(**s))
                db.flush()
            except Exception as e:
                print(f"Error adding student {s.get('id')}: {str(e)}")
                raise

        print("Adding classes...")
        for c in data.get("class", []):
            try:
                print(f"Adding class with ID: {c.get('id')} for teacher {c.get('ownerID')}")
                db.add(DBClass(**c))
                db.flush()
            except Exception as e:
                print(f"Error adding class {c.get('id')}: {str(e)}")
                raise

        print("Adding enrollments...")
        for e in data.get("enrolled", []):
            try:
                print(f"Adding enrollment for student {e.get('studentID')} in class {e.get('classID')}")
                db.add(DBEnrolled(**e))
                db.flush()
            except Exception as e:
                print(f"Error adding enrollment: {str(e)}")
                raise

        print("Adding units...")
        for u in data.get("unit", []):
            try:
                db.add(DBUnit(**u))
                db.flush()
            except Exception as e:
                print(f"Error adding unit {u.get('id')}: {str(e)}")
                raise

        print("Adding modules...")
        for m in data.get("module", []):
            db.add(DBModule(**m))

        print("Adding days...")
        for d in data.get("day", []):
            db.add(DBDay(**d))

        print("Adding assignments...")
        for a in data.get("assignment", []):
            db.add(DBAssignment(**a))

        print("Adding materials...")
        for m in data.get("material", []):
            db.add(DBMaterial(**m))

        print("Committing all changes...")
        db.commit()
        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error while populating database: {e}")

    finally:
        db.close()
