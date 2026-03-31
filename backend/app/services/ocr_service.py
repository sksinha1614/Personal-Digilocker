import ssl
from pathlib import Path
from typing import Optional

import certifi
import easyocr
import fitz

from app.utils.text_utils import join_chunks

_reader: Optional[easyocr.Reader] = None
_init_error: Optional[str] = None


def _configure_ssl_certificates() -> None:
    # EasyOCR downloads model files via urllib, so point Python's default HTTPS
    # context at certifi's CA bundle to avoid local certificate-store issues.
    ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())


def init_ocr_reader() -> bool:
    global _reader, _init_error
    if _reader is not None:
        return True
    try:
        _configure_ssl_certificates()
        _reader = easyocr.Reader(["en"], gpu=False)
        _init_error = None
    except Exception:
        _reader = None
        _init_error = "Image OCR model could not be initialized. Fix SSL certificates/network, then retry."
        return False
    return True


def extract_text_from_pdf(file_path: str) -> str:
    chunks = []
    with fitz.open(file_path) as pdf:
        for page in pdf:
            chunks.append(page.get_text("text"))
    return join_chunks(chunks)


def extract_text_from_image(file_path: str) -> str:
    if _reader is None and not init_ocr_reader():
        raise RuntimeError(_init_error or "Image OCR model could not be initialized.")
        
    try:
        from PIL import Image, ImageEnhance
        import io
        
        with Image.open(file_path) as img:
            img = img.convert("L")  # Grayscale
            img = ImageEnhance.Contrast(img).enhance(1.8)  # Boost contrast
            img = ImageEnhance.Sharpness(img).enhance(1.2) # Modest sharpen
            
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format="PNG")
            image_payload = img_byte_arr.getvalue()
    except Exception as e:
        print(f"Warning: OCR image enhancement failed: {e}")
        image_payload = file_path

    # detail=0 drops bounding box info, we just want text strings. Let EasyOCR handle internal binarization too.
    results = _reader.readtext(image_payload, detail=0)
    return join_chunks(results)


def extract_text(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    return extract_text_from_image(file_path)
