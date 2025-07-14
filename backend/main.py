"""Assignment #1 FastAPI application.

Args:
    app: The FastAPI instance

Usage:
    run `fastapi dev` or `poetry run fastapi dev` to start the server
"""

from fastapi import FastAPI
from fastapi.requests import Request
import os
import requests
from dotenv import load_dotenv
from backend.routers import home, classroom, unit,module,day,assignment, material
from backend.Seed_Database import PopulateDB
from fastapi.middleware.cors import CORSMiddleware
from backend.exceptions import EntityNotFoundException, FileNotFoundException, DuplicateNameException

PopulateDB()
app = FastAPI(
    title="TAi",
    summary="An always available, class specific TA."
)

app.include_router(home.router)
app.include_router(classroom.router)
app.include_router(unit.router)
app.include_router(module.router)
app.include_router(day.router)
app.include_router(assignment.router)
app.include_router(material.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(EntityNotFoundException)
def handle_entity_not_found(request: Request, exception: EntityNotFoundException):
    return exception.response()
@app.exception_handler(FileNotFoundException)
def handle_file_not_found(request: Request, exception: EntityNotFoundException):
    return exception.response()
@app.exception_handler(DuplicateNameException)
def handle_duplicate_name(request: Request, exception: DuplicateNameException):
    return exception.response()

"""
load_dotenv() 

def generate_response(prompt):
    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Example usage
response = generate_response("Write a one-sentence bedtime story about a unicorn.")
print(response['choices'][0]['message']['content'])
"""
# todo: add routes and logic here 

# TODO: Route for a teacher or student ID from the DB   

# TODO: Route for getting all the classes a student is enrolled in 