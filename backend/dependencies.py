from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from typing import Annotated
from fastapi  import Depends

# Database connection URL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://username:password@localhost/db_name"

# Create an engine that will connect to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_size=5, max_overflow=10)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DBSession = Annotated[Session, Depends(get_db)]