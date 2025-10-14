"""Assignment #1 FastAPI application.

Args:
    app: The FastAPI instance

Usage:
    run `fastapi dev` or `poetry run fastapi dev` to start the server
"""


from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import requests
from dotenv import load_dotenv
from backend.routers import home, classroom, unit, module, day, assignment, material, student, teacher, chat
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

# Optional Firebase initialization (guarded for deployment environments without credentials)
basedir = pathlib.Path(__file__).parent
load_dotenv(basedir / ".env")
try:
    FIREBASE_ACTIVE = os.getenv("FIREBASE_ACTIVE", "false").lower() == "true"
    if FIREBASE_ACTIVE:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", str(basedir / "service-account.json"))
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            print("TAI:", firebase_admin.get_app().project_id)
        else:
            print(f"[startup] FIREBASE_ACTIVE is true but credentials not found at: {cred_path}. Skipping Firebase init.")
    else:
        print("[startup] Firebase disabled (FIREBASE_ACTIVE=false).")
except Exception as e:
    print(f"[startup] Firebase init skipped due to error: {e}")



app = FastAPI(
    title="TAi",
    summary="An always available, class specific TA."
)


# Configure CORS for development
origins = [
    "http://localhost:3000",  # Default React dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Only serve static files in production
if os.getenv("NODE_ENV") == "production":
    app.mount("/static", StaticFiles(directory="tai-frontend/build/static"), name="static")


@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.on_event("startup")
def maybe_seed():
    """
    Conditionally seed the database on startup.
    Set INIT_DB_ON_STARTUP=true in your environment variables to enable seeding.
    This is useful for local development but should be disabled in production.
    """
    if os.getenv("INIT_DB_ON_STARTUP", "false").lower() == "true":
        try:
            PopulateDB()
        except Exception as e:
            print(f"[startup] PopulateDB failed: {e}")
        
@app.get("/")
def serve_frontend():
    return FileResponse("tai-frontend/build/index.html")


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