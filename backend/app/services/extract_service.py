from typing import Any, Dict

from app.services.ai_service import extract_structured_fields
from app.services.ocr_service import extract_text

OCR_UNAVAILABLE_TEXT = "[[OCR_UNAVAILABLE]]"
PROCESSING_TIMEOUT_TEXT = "[[PROCESSING_TIMEOUT]]"


def process_document(file_path: str) -> Dict[str, Any]:
    raw_text = extract_text(file_path)
    fields = extract_structured_fields(raw_text)
    return {"raw_text": raw_text, "fields": fields}
