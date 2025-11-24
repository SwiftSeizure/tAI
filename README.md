Our git hub is set up to automatically run our action to redoploy our remote hosting, whenever a new push is made.
It runs our list of deployment commands as specified in our docker file. You should never need to run the application locally.
However here are the commands to do so.

Frontend (cd tai-frontend)
npm install
npm run start
(the remote will run npm run build for deployment this is not neccesary for production branches)

Backend (project root)
poetry install
poetry run uvicorn backend.main:app
