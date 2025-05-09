from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .schema import DBUnit, DBModule, DBDay
from backend.models import CreateModule, UnitUpdate
from backend.exceptions import EntityNotFoundException, DuplicateNameException

def get_unit(unitID: int, session: Session) -> DBUnit:
    """ Get a DBUnit object by its ID.
    
    Args:
        unitID (int): The ID of the unit to retrieve.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the unit with the given ID does not exist.
        
    Returns:
        DBUnit: The DBUnit object if found."""
    stmt = select(DBUnit).filter(DBUnit.id == unitID)
    unit = session.execute(stmt).scalar_one_or_none()
    if not unit:
        raise EntityNotFoundException("unit", unitID)
    
    return unit

def get_unit_modules(unitID: int, session: Session) -> list[DBModule]:
    """ Get all modules in a unit.
    
    Args:
        unitID (int): The ID of the unit to retrieve modules from.
        session (Session): The SQLAlchemy session to use for the query.
        
    Raises:
        EntityNotFoundException: If the unit with the given ID does not exist.
        
    Returns:
        list[DBModule]: A list of DBModule objects representing the modules in the unit.
    """
    stmt = (
        select(DBUnit)
        .options(selectinload(DBUnit.modules).selectinload(DBModule.days))
        .filter(DBUnit.id == unitID)
    )
    unit = session.execute(stmt).scalar_one_or_none()
    if not unit:
        raise EntityNotFoundException("unit", unitID)
    
    return list(unit.modules)

def create_new_module(unitID: int, module: CreateModule, session: Session) -> DBModule:
    """Create a new module in a unit.

    Args:
        unitID (int): The ID of the unit to create the module in.
        module (CreateModule): The data for the new module.
        session (Session): The SQLAlchemy session to use for the query.

    Raises:
        EntityNotFoundException: If the unit with the given ID does not exist.

    Returns:
        DBModule: The newly created DBUnit object.
    """
    unit = get_unit(unitID, session)
    
    # Get the highest sequence number and add 1
    stmt = select(DBModule.sequence)\
        .filter(DBModule.unitID == unitID)\
        .order_by(DBModule.sequence.desc())\
        .limit(1)
    result = session.execute(stmt).scalar()
    sequenceNumber = (result or 0) + 1
    
    # Check for duplicate unit name
    duplicateStmt = select(DBModule)\
        .filter(DBModule.unitID == unitID, 
                DBModule.name == module.name)
    existingModule = session.execute(duplicateStmt).scalar_one_or_none()
    if existingModule:
        raise DuplicateNameException("module", module.name)
    
    # Create the new module
    db_module = DBModule(
        name = module.name,
        sequence = sequenceNumber,
        unitID = unitID,
    )
    
    # Add the new unit to the database
    unit.modules.append(db_module)
    session.add(unit)
    session.commit()
    return db_module
    
    
def update_unit(unitID: int, unitUpdates: UnitUpdate, session: Session) -> DBUnit:
    """Update a classroom name and/or settings.
    
    Args:
        ClassID (int) : The id of the classroom being updated
        classroomUpdates (ClassroomUpdate): The updates to apply to a classroom.
        session (Session): The database session
        
    Returns:
        DBClassroom: The updated classroom.
    """
    unit = get_unit(unitID, session) # get_unit will raise exception if not found
    
    # Update the classroom name
    if unitUpdates.name:
        # Check for duplicate name if name is being updated
        duplicate_stmt = select(DBUnit)\
            .filter(
                DBUnit.id != unitID,  # Exclude current classroom
                DBUnit.name == unitUpdates.name,
                DBUnit.classID == unit.classID  # Add teacher check
            )
        existing_unit = session.execute(duplicate_stmt).scalar_one_or_none()
        if existing_unit:
            raise DuplicateNameException("unit", unitUpdates.name)
        unit.name = unitUpdates.name # type: ignore
    
    # Update the classroom settings
    if unitUpdates.settings:
        unit.settings = unitUpdates.settings # type: ignore
    
    session.commit()
    return unit