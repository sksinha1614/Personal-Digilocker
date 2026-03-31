# Personal DigiLocker

Personal DigiLocker is a full-stack document vault for storing personal ID files, extracting key fields, and asking questions about uploaded documents through a chat assistant.

## Features

- Upload PDF, PNG, JPG, and JPEG documents
- Extract fields such as name, date of birth, ID number, address, gender, expiry, and issuer
- View uploaded documents inside the app
- Ask questions like "What is my Aadhaar number?" or "When does my passport expire?"
- Fallback responses when AI or OCR is unavailable

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand
- Backend: FastAPI, SQLAlchemy, SQLite
- OCR and parsing: EasyOCR, PyMuPDF
- AI: Groq API

## Project Structure

- `frontend/` - React client
- `backend/` - FastAPI server

## Notes

- Uploaded files are stored locally
- SQLite is used as the default database
- OCR on image files may take longer than PDF text extraction
