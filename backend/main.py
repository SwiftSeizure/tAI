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
from backend.Seed_Database import PopulateDB, InitializeDB
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
import json
import base64
# we need to load the env file because it contains the GOOGLE_APPLICATION_CREDENTIALS
# unneeded in production because we will set the env var directly there
#basedir = pathlib.Path(__file__).parent
#load_dotenv(basedir / ".env")

# This version for deployment
##svc_dct = json.loads(base64.b64decode(b64).decode("utf-8")) #type:ignore
service_account_info = json.loads(os.environ["SERVICE_ACCOUNT_JSON"])
cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred)

print("TAI:",firebase_admin.get_app().project_id)



app = FastAPI(
    title="TAi",
    summary="An always available, class specific TA."
)


# Configure CORS for development and production
origins = [
    "http://localhost:3000",  # Default React dev server
    "http://127.0.0.1:3000",
    "http://taiteach.com",    # Production frontend
    "https://taiteach.com",   # Production frontend with HTTPS
    "http://api.taiteach.com", # Production API
    "https://api.taiteach.com", # Production API with HTTPS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files - check for production environment or if build directory exists
build_static_path = "tai-frontend/build/static"
if os.getenv("NODE_ENV") == "production" or os.path.exists(build_static_path):
    app.mount("/static", StaticFiles(directory=build_static_path), name="static")
    print(f"[startup] Static files mounted from: {build_static_path}")
else:
    print(f"[startup] Static files directory not found: {build_static_path}")


@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.on_event("startup")
def maybe_initialize_db():
    """
    Conditionally initialize or seed the database on startup.
    - Set INIT_DB_ON_STARTUP=true to seed the database with test data (for development)
    - Set INIT_DB_TABLES_ONLY=true to only create tables without data (for production)
    """
    init_db = os.getenv("INIT_DB_ON_STARTUP", "false").lower() == "true"
    init_tables_only = os.getenv("INIT_DB_TABLES_ONLY", "false").lower() == "true"
    
    if init_db:
        try:
            print("[startup] Seeding database with test data...")
            PopulateDB()
            print("[startup] Database seeded successfully.")
        except Exception as e:
            print(f"[startup] PopulateDB failed: {e}")
    elif init_tables_only:
        try:
            print("[startup] Initializing database tables...")
            InitializeDB()
            print("[startup] Database tables initialized successfully.")
        except Exception as e:
            print(f"[startup] InitializeDB failed: {e}")
    else:
        print("[startup] Database initialization skipped.")
        
@app.get("/")
def serve_frontend():
    """Serve the main React app HTML file"""
    return FileResponse("tai-frontend/build/index.html")

@app.get("/favicon.ico")
def serve_favicon():
    """Serve favicon"""
    return FileResponse("tai-frontend/build/favicon.ico")

@app.get("/manifest.json")
def serve_manifest():
    """Serve web app manifest"""
    return FileResponse("tai-frontend/build/manifest.json")

@app.get("/logo192.png")
def serve_logo192():
    """Serve 192px logo"""
    return FileResponse("tai-frontend/build/logo192.png")

@app.get("/logo512.png")
def serve_logo512():
    """Serve 512px logo"""
    return FileResponse("tai-frontend/build/logo512.png")


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