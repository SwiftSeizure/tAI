from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

# Declare the base class for models
Base = declarative_base()

class DBStudent(Base):
    __tablename__ = "student" 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    classes = relationship("Enrolled", back_populates="student")

class DBTeacher(Base):
    __tablename__ = "teacher"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    classes = relationship("Class", back_populates="owner", cascade="all, delete")

class DBEnrolled(Base):
    __tablename__ = "enrolled"
    
    id = Column(Integer, primary_key=True, index=True)
    
    studentID = Column(Integer, ForeignKey("student.id", ondelete="CASCADE"))
    classID = Column(Integer, ForeignKey("class.id", ondelete="CASCADE"))

    student = relationship("Student", back_populates="classes")
    class_ = relationship("Class", back_populates="enrollment") 

class DBClass(Base):
    __tablename__ = "class"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    
    ownerID = Column(Integer, ForeignKey("teacher.id", ondelete="CASCADE"))

    owner = relationship("Teacher", back_populates="classes")
    enrollment = relationship("Enrolled", back_populates="class_")
    
    settings = Column(JSON, nullable=False)
