from pathlib import Path

import aiofiles
from fastapi import UploadFile

from app.config import BASE_DIR, settings
from app.utils.file_utils import build_stored_filename


UPLOAD_PATH = BASE_DIR / settings.upload_dir
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)


async def save_upload_file(upload_file: UploadFile) -> str:
    stored_name = build_stored_filename(upload_file.filename or "document")
    destination = UPLOAD_PATH / stored_name
    content = await upload_file.read()
    async with aiofiles.open(destination, "wb") as out:
        await out.write(content)
    await upload_file.seek(0)
    return str(destination)


def delete_file(file_path: str) -> None:
    path = Path(file_path)
    if path.exists():
        path.unlink()
