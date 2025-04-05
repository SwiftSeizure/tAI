"""Assignment #1 FastAPI application.

Args:
    app: The FastAPI instance

Usage:
    run `fastapi dev` or `poetry run fastapi dev` to start the server
"""

from fastapi import FastAPI
import os
import requests
from dotenv import load_dotenv
from backend.routers import home
from backend.Seed_Database import PopulateDB

PopulateDB()
app = FastAPI(
    title="TAi",
    summary="An always available, class specific TA."
)

app.include_router(home.router)

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