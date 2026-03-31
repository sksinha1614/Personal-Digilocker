import asyncio
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.extract_service import OCR_UNAVAILABLE_TEXT, PROCESSING_TIMEOUT_TEXT, process_document
from app.services.storage_service import delete_file, save_upload_file
from app.utils.file_utils import get_file_size, validate_extension

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    category: Optional[str] = Form(None),
    sub_category: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename found.")
    try:
        validate_extension(file.filename)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    file_size = get_file_size(file)
    if file_size > settings.max_file_size_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds allowed limit.")

    stored_path = await save_upload_file(file)
    fallback_fields = {
        "doc_type": None,
        "name": None,
        "dob": None,
        "id_number": None,
        "address": None,
        "gender": None,
        "expiry": None,
        "issuer": None,
    }
    try:
        processed = await asyncio.wait_for(
            asyncio.to_thread(process_document, stored_path),
            timeout=settings.processing_timeout_seconds,
        )
        fields = processed["fields"]
        raw_text = processed["raw_text"]
    except asyncio.TimeoutError:
        fields = fallback_fields
        raw_text = PROCESSING_TIMEOUT_TEXT
    except RuntimeError:
        fields = fallback_fields
        raw_text = OCR_UNAVAILABLE_TEXT
    except Exception as exc:
        delete_file(stored_path)
        raise HTTPException(status_code=500, detail="Document processing failed.") from exc

    # If user selected a sub_category, use it as doc_type if AI didn't detect one
    effective_doc_type = fields.get("doc_type") or sub_category

    doc = Document(
        filename=file.filename,
        file_path=stored_path,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        category=category,
        sub_category=sub_category,
        raw_text=raw_text,
        doc_type=effective_doc_type,
        name=fields.get("name"),
        dob=fields.get("dob"),
        id_number=fields.get("id_number"),
        address=fields.get("address"),
        gender=fields.get("gender"),
        expiry=fields.get("expiry"),
        issuer=fields.get("issuer"),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/", response_model=List[DocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    delete_file(doc.file_path)
    db.delete(doc)
    db.commit()
    return None


@router.get("/{doc_id}/file")
def serve_document_file(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if not Path(doc.file_path).exists():
        raise HTTPException(status_code=404, detail="File is missing from storage.")
    return FileResponse(path=doc.file_path, media_type=doc.mime_type, filename=doc.filename)
