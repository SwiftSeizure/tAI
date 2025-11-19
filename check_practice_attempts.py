from backend.dependencies import SessionLocal
from backend.database.schema import DBPracticeAttempt

session = SessionLocal()
attempts = session.query(DBPracticeAttempt).order_by(DBPracticeAttempt.id).all()

print(f'\nTotal practice attempts: {len(attempts)}\n')
print('-' * 80)

for attempt in attempts:
    result = "✓ CORRECT" if attempt.is_correct else "✗ INCORRECT"
    print(f'ID: {attempt.id}')
    print(f'Student ID: {attempt.studentID}')
    print(f'Class ID: {attempt.classID}')
    print(f'Path: {attempt.path}')
    print(f'Level: {attempt.level}')
    print(f'Result: {result}')
    print('-' * 80)

session.close()
