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
 
# This version for deployment
## START Deployment needed
svc_json = os.getenv("SERVICE_ACCOUNT_JSON")
if svc_json is None:
    raise ValueError("SERVICE_ACCOUNT_JSON environment variable is not set")
svc_dct = json.loads(svc_json)
cred = credentials.Certificate(svc_dct)
firebase_admin.initialize_app(cred)
print("TAI:",firebase_admin.get_app().project_id) 
## END Deployment needed

# This is for local
## START Local needed
# service_account_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
# if not os.path.exists(service_account_path):
#     raise FileNotFoundError(f"Service account file not found at {service_account_path}")

# cred = credentials.Certificate(service_account_path)
# firebase_admin.initialize_app(cred)
# print("TAI:", firebase_admin.get_app().project_id)
## END Local needed


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
    # Temporarily disabled to prevent data loss during development with hot reload
    print("[startup] Database initialization skipped (disabled during development).")
    
    
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


# Include API routers FIRST (before catch-all routes)
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


# Serve React app static assets - MUST BE AFTER API ROUTES
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


# CATCH-ALL ROUTE - MUST BE LAST!
# This handles all React Router routes (like /home, /unitpage, etc.)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """
    Catch-all route to serve the React app for any unmatched routes.
    This enables React Router to handle client-side routing.
    """
    # Serve index.html for all routes that don't match API endpoints
    return FileResponse("tai-frontend/build/index.html")