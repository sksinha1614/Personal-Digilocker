from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ExtractedFields(BaseModel):
    doc_type: Optional[str] = None
    name: Optional[str] = None
    dob: Optional[str] = None
    id_number: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None
    expiry: Optional[str] = None
    issuer: Optional[str] = None


class DocumentResponse(ExtractedFields):
    id: int
    filename: str
    file_path: str
    mime_type: str
    file_size: int
    category: Optional[str] = None
    sub_category: Optional[str] = None
    raw_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
