import pytest
from backend.database.schema import DBEnrolled


def test_enroll_student(client):
    # Arrange: enroll student 2 in class with classCode 1010
    payload = {"id": 2, "classCode": 1010}
    response = client.post("/student/enroll", json=payload)

    # Assert: API response is correct
    assert response.status_code == 204

    # Query DB directly using the same test session
    from backend.dependencies import get_db
    session = next(get_db())

    result = session.query(DBEnrolled).filter_by(studentID=2).first()
    session.close()

    assert result is not None
