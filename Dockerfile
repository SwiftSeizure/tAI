FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libmagic1 libmagic-mgc \
    ffmpeg \
    poppler-utils \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pyproject.toml poetry.lock* /app/

RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi --only main

COPY . /app

COPY tai-frontend/build/ /app/tai-frontend/build/

ENV DATA_ROOT="/var/appdata" \
    PORT=8080
EXPOSE 8080

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
