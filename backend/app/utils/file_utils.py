import os
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


def validate_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported file type. Please upload PDF, PNG, JPG, or JPEG.")
    return ext


def build_stored_filename(original_name: str) -> str:
    ext = Path(original_name).suffix.lower()
    return f"{uuid4().hex}{ext}"


def get_file_size(upload_file: UploadFile) -> int:
    upload_file.file.seek(0, os.SEEK_END)
    size = upload_file.file.tell()
    upload_file.file.seek(0)
    return size
