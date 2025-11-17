"""
Migration script to add classID column to practice_attempt table
Run this once to update your database schema
"""
from backend.dependencies import SessionLocal, engine
from sqlalchemy import text

def add_classid_column():
    """Add classID column to practice_attempt table"""
    session = SessionLocal()
    
    try:
        # Check if column already exists
        result = session.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='practice_attempt' AND column_name='classID'
        """))
        
        if result.fetchone():
            print("classID column already exists in practice_attempt table")
            return
        
        # Add the column
        print("Adding classID column to practice_attempt table...")
        session.execute(text("""
            ALTER TABLE practice_attempt 
            ADD COLUMN classID INTEGER
        """))
        
        # Add foreign key constraint
        print("Adding foreign key constraint...")
        session.execute(text("""
            ALTER TABLE practice_attempt 
            ADD CONSTRAINT practice_attempt_classID_fkey 
            FOREIGN KEY (classID) REFERENCES class(id) ON DELETE CASCADE
        """))
        
        session.commit()
        print("✓ Successfully added classID column to practice_attempt table")
        
    except Exception as e:
        session.rollback()
        print(f"✗ Error: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    print("Running database migration...")
    add_classid_column()
    print("Migration complete!")
