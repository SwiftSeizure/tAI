"""Assignment #1 FastAPI application.

Args:
    app: The FastAPI instance

Usage:
    run `fastapi dev` or `poetry run fastapi dev` to start the server
"""

from fastapi import FastAPI
from fastapi.requests import Request
from backend.routers import home, classroom, unit,module,day,assignment, material,student,teacher,chat
from backend.Seed_Database import PopulateDB
from fastapi.middleware.cors import CORSMiddleware
from backend.exceptions import EntityNotFoundException, UploadNotFoundException, DuplicateNameException, InvalidClassCodeException, UnauthorizedException
#import os
#import requests



""" 
https://medium.com/%40gabriel.cournelle/firebase-authentication-in-the-backend-with-fastapi-4ff3d5db55ca
Firebase Auth Flow implimented from the above link
Mixed with some troubleshooting from AI
"""
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv
import pathlib
# we need to load the env file because it contains the GOOGLE_APPLICATION_CREDENTIALS
basedir = pathlib.Path(__file__).parent
load_dotenv(basedir / ".env")
cred = credentials.Certificate(basedir / "service-account.json")
firebase_admin.initialize_app(cred)
print("TAI:",firebase_admin.get_app().project_id)


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
app.include_router(student.router)
app.include_router(teacher.router)
app.include_router(chat.router)


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
@app.exception_handler(UploadNotFoundException)
def handle_file_not_found(request: Request, exception: EntityNotFoundException):
    return exception.response()
@app.exception_handler(DuplicateNameException)
def handle_duplicate_name(request: Request, exception: DuplicateNameException):
    return exception.response()
@app.exception_handler(InvalidClassCodeException)
def handle_invalid_class_code(request: Request, exception: InvalidClassCodeException):
    return exception.response()
@app.exception_handler(UnauthorizedException)
def handle_unauthorized(request: Request, exception: UnauthorizedException):
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