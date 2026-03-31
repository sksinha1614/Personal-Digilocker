from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False, unique=True)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    raw_text = Column(Text, nullable=True)
    doc_type = Column(String(100), nullable=True)
    name = Column(String(255), nullable=True)
    dob = Column(String(50), nullable=True)
    id_number = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    gender = Column(String(50), nullable=True)
    expiry = Column(String(100), nullable=True)
    issuer = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
