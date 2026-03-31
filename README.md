# Personal DigiLocker

A simple full-stack personal document locker with file upload, document extraction, and a chat assistant for asking questions about uploaded IDs such as Aadhaar, PAN, and passport details.

## Project Structure

- `backend/` - FastAPI backend, SQLite database, OCR/extraction logic
- `frontend/` - React + Vite frontend

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Files

Create these files locally and do not commit them:

- `backend/.env`
- `frontend/.env`

Typical values:

```env
# backend/.env
GROQ_API_KEY=your_key_here
DATABASE_URL=sqlite:///./digilocker.db
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
PROCESSING_TIMEOUT_SECONDS=20
```

```env
# frontend/.env
VITE_API_URL=http://localhost:8000
```

## Push To GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repository on GitHub, then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/personal-digilocker.git
git push -u origin main
```

## Future Updates

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Important Note

Never commit:

- API keys
- `.env` files
- local uploads
- database files
- virtual environments
- `node_modules`
