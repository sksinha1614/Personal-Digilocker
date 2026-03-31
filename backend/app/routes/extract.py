import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.extract_service import OCR_UNAVAILABLE_TEXT, PROCESSING_TIMEOUT_TEXT, process_document
from app.utils.document_parser import EMPTY_FIELDS

router = APIRouter(prefix="/api/extract", tags=["extract"])


@router.post("/{doc_id}", response_model=DocumentResponse)
async def re_extract(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        processed = await asyncio.wait_for(
            asyncio.to_thread(process_document, doc.file_path),
            timeout=settings.processing_timeout_seconds,
        )
        fields = processed["fields"]
        doc.raw_text = processed["raw_text"]
    except asyncio.TimeoutError:
        fields = dict(EMPTY_FIELDS)
        doc.raw_text = PROCESSING_TIMEOUT_TEXT
    except RuntimeError:
        fields = dict(EMPTY_FIELDS)
        doc.raw_text = OCR_UNAVAILABLE_TEXT

    doc.doc_type = fields.get("doc_type")
    doc.name = fields.get("name")
    doc.dob = fields.get("dob")
    doc.id_number = fields.get("id_number")
    doc.address = fields.get("address")
    doc.gender = fields.get("gender")
    doc.expiry = fields.get("expiry")
    doc.issuer = fields.get("issuer")
    db.commit()
    db.refresh(doc)
    return doc
