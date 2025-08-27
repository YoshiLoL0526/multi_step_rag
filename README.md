# Multi-Step RAG Application

A full-stack application implementing multi-step Retrieval Augmented Generation (RAG) with a FastAPI backend and a frontend interface.

## Project Structure

```
├── backend/
│   ├── requirements.txt
│   ├── run.py
│   └── src/
│       ├── core/
│       ├── models/
│       ├── routers/
│       └── schemas/
└── frontend/
```

## Backend

The backend is built with FastAPI and implements the RAG pipeline.

### Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the development server:

```bash
python run.py
```

The API will be available at `http://localhost:8000` by default. API documentation can be accessed at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend

[To be implemented]

## Features

- FastAPI backend with CORS support
- Modular project structure
- API documentation with Swagger UI and ReDoc
- Environment-based configuration
