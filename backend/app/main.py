from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import chat, documents, extract
from app.services.ocr_service import init_ocr_reader

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal DigiLocker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    # Warm-up is best effort only; app should still boot if OCR model download fails.
    init_ocr_reader()


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(extract.router)
