import json
from sqlalchemy.orm import Session
from backend.database.schema import DBStudent, DBTeacher, DBClass, DBEnrolled, DBUnit, Base
from backend.dependencies import engine, SessionLocal
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_FILE_PATH = os.path.join(BASE_DIR, "seed_data.json")

def PopulateDB(file: str =  SEED_FILE_PATH): 
    
    Base.metadata.create_all(bind=engine)
    print("populating")
    db: Session = SessionLocal()

    try:
        print("gothere")
        with open(file, "r") as f:
            data = json.load(f)
        print("didnt get here")
        db.query(DBEnrolled).delete()
        db.query(DBClass).delete()
        db.query(DBStudent).delete()
        db.query(DBTeacher).delete()
        db.commit()
        for t in data.get("teachers", []):
            db.add(DBTeacher(**t))

        for s in data.get("students", []):
            db.add(DBStudent(**s))

        for c in data.get("classes", []):
            db.add(DBClass(**c))
            
        for u in data.get("units", []):
            db.add(DBUnit(**u))

        for e in data.get("enrollments", []):
            db.add(DBEnrolled(**e))

        db.commit()
        print("commited!!!!!!!!!!!")

    except Exception as e:
        db.rollback()
     
    finally:
        db.close()
