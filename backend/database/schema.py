from sqlalchemy import Column, Integer, String, ForeignKey, JSON,Boolean 
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

# Declare the base class for models
Base = declarative_base()

class DBStudent(Base):
    __tablename__ = "student" 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    userName = Column(String(25), nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    classes = relationship("DBEnrolled", back_populates="student")

class DBTeacher(Base):
    __tablename__ = "teacher"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    userName = Column(String(25), nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    classes = relationship("DBClass", back_populates="owner", cascade="all, delete")

class DBEnrolled(Base):
    __tablename__ = "enrolled"
    
    id = Column(Integer, primary_key=True, index=True)
    
    studentID = Column(Integer, ForeignKey("student.id", ondelete="CASCADE"))
    classID = Column(Integer, ForeignKey("class.id", ondelete="CASCADE"))

    student = relationship("DBStudent", back_populates="classes")
    class_ = relationship("DBClass", back_populates="enrollment") 

class DBClass(Base):
    __tablename__ = "class"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    
    ownerID = Column(Integer, ForeignKey("teacher.id", ondelete="CASCADE"))
    classCode = Column(Integer, nullable = False)
    published = Column(Boolean,nullable = False)

    owner = relationship("DBTeacher", back_populates="classes")
    enrollment = relationship("DBEnrolled", back_populates="class_")
    units = relationship("DBUnit", back_populates="class_", order_by="DBUnit.sequence", cascade="all, delete")
    
    settings = Column(JSON, nullable=False)
    
class DBUnit(Base):
    __tablename__ = "unit"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    sequence = Column(Integer, nullable=False)
    classID = Column(Integer, ForeignKey("class.id", ondelete="CASCADE"))

    class_ = relationship("DBClass", back_populates="units")
    modules = relationship("DBModule", back_populates="unit")
    
    settings = Column(JSON, nullable=True)


class DBModule(Base):
    __tablename__ = "module"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(25), nullable=False)
    sequence = Column(Integer, nullable=False)
    unitID = Column(ForeignKey("unit.id",ondelete="CASCADE"))

    unit = relationship("DBUnit",back_populates="modules")
    days = relationship("DBDay",back_populates="module",cascade="all, delete-orphan")

    settings = Column(JSON, nullable=True)


class DBDay(Base):
    __tablename__ = "day"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(25), nullable=False)
    sequence = Column(Integer, nullable=False)
    moduleID = Column(Integer, ForeignKey("module.id", ondelete="CASCADE"))

    assignments = relationship("DBAssignment",back_populates="day")
    materials = relationship("DBMaterial",back_populates="day")
    module = relationship("DBModule",back_populates="days")
    
    settings = Column(JSON, nullable=True)

class DBAssignment(Base):
    __tablename__ = "assignment"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(25), nullable=False)
    filename = Column(String(225), nullable=False)
    sequence = Column(Integer, nullable=False)
    path = Column(String(255),nullable=False)
    dayId = Column(ForeignKey("day.id"))

    day = relationship("DBDay", back_populates="assignments")

class DBMaterial(Base):
    __tablename__ = "material"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(25), nullable=False)
    filename = Column(String(225), nullable=False)
    sequence = Column(Integer, nullable=False)
    path = Column(String(255),nullable=False)
    dayId = Column(ForeignKey("day.id"))

    day = relationship("DBDay", back_populates="materials")

class DBConversation(Base):
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True, index=True)
    studentID = Column(ForeignKey("student.id", ondelete="CASCADE"))
    path = Column(String(255), nullable=True)

    student = relationship("DBStudent")
    messages = relationship("DBMessage", back_populates="conversation", cascade="all, delete-orphan")
    responses = relationship("DBResponse", back_populates="conversation", cascade="all, delete-orphan")


class DBMessage(Base):
    __tablename__ = "message"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(255), nullable=False)
    conversationID = Column(ForeignKey("conversation.id", ondelete="CASCADE"))
    
    conversation = relationship("DBConversation", back_populates="messages")

class DBResponse(Base):
    __tablename__ = "response"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(255), nullable=False)
    conversationID = Column(ForeignKey("conversation.id", ondelete="CASCADE"))
    
    conversation = relationship("DBConversation", back_populates="responses")    

