from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import answer_from_documents
from app.utils.document_parser import extract_fields_locally

router = APIRouter(prefix="/api/chat", tags=["chat"])
OCR_UNAVAILABLE_TEXT = "[[OCR_UNAVAILABLE]]"
PROCESSING_TIMEOUT_TEXT = "[[PROCESSING_TIMEOUT]]"


def _is_aadhaar_query(question: str) -> bool:
    q = question.lower()
    return any(token in q for token in ("aadhaar", "aadhar", "adhar"))


def build_context(documents: list[Document]) -> str:
    if not documents:
        return "User has no uploaded documents."
    rows = []
    for d in documents:
        parsed_raw = extract_fields_locally(d.raw_text or "")
        doc_type = d.doc_type or parsed_raw.get("doc_type")
        name = d.name or parsed_raw.get("name")
        dob = d.dob or parsed_raw.get("dob")
        id_number = d.id_number or parsed_raw.get("id_number")
        address = d.address or parsed_raw.get("address")
        gender = d.gender or parsed_raw.get("gender")
        expiry = d.expiry or parsed_raw.get("expiry")
        issuer = d.issuer or parsed_raw.get("issuer")
        rows.append(
            (
                f"- filename={d.filename}, doc_type={doc_type}, name={name}, dob={dob}, "
                f"id_number={id_number}, address={address}, gender={gender}, "
                f"expiry={expiry}, issuer={issuer}"
            )
        )
    return "User has these documents:\n" + "\n".join(rows)


def _local_fallback_answer(question: str, documents: list[Document]) -> str:
    q = question.lower()
    enriched_docs = []
    for d in documents:
        parsed_raw = extract_fields_locally(d.raw_text or "")
        enriched_docs.append(
            {
                "doc": d,
                "doc_type": d.doc_type or parsed_raw.get("doc_type"),
                "name": d.name or parsed_raw.get("name"),
                "dob": d.dob or parsed_raw.get("dob"),
                "id_number": d.id_number or parsed_raw.get("id_number"),
                "address": d.address or parsed_raw.get("address"),
                "gender": d.gender or parsed_raw.get("gender"),
                "expiry": d.expiry or parsed_raw.get("expiry"),
                "issuer": d.issuer or parsed_raw.get("issuer"),
                "raw_text": d.raw_text,
            }
        )

    aadhaar_doc = next(
        (item for item in enriched_docs if (item["doc_type"] or "").lower().find("aadhaar") >= 0),
        None,
    )
    pan_doc = next((item for item in enriched_docs if (item["doc_type"] or "").lower().find("pan") >= 0), None)

    if _is_aadhaar_query(q):
        if aadhaar_doc and aadhaar_doc["id_number"]:
            return f"Your Aadhaar number is {aadhaar_doc['id_number']}."
        return "I could not find an Aadhaar number in your saved extracted fields yet."
    if "name" in q:
        named_doc = next((item for item in enriched_docs if item["name"]), None)
        if named_doc:
            return f"The name in your document is {named_doc['name']}."
        return "I could not find a name in your saved document data yet."
    if "pan" in q:
        if pan_doc and pan_doc["id_number"]:
            return f"Your PAN number is {pan_doc['id_number']}."
        return "I could not find PAN details in your saved extracted fields yet."
    if "dob" in q or "date of birth" in q or "birth" in q:
        with_dob = next((item for item in enriched_docs if item["dob"]), None)
        if with_dob:
            return f"The date of birth in your document is {with_dob['dob']}."
        return "I could not find a date of birth in your saved document data yet."
    if "expire" in q or "expiry" in q:
        with_expiry = [item for item in enriched_docs if item["expiry"]]
        if with_expiry:
            item = with_expiry[0]
            return f"The expiry date in your documents is {item['expiry']} ({item['doc'].filename})."
        return "I could not find any expiry date in your saved extracted fields yet."

    with_ids = [item for item in enriched_docs if item["id_number"]]
    if with_ids:
        listed = ", ".join(f"{item['doc_type'] or 'Document'}: {item['id_number']}" for item in with_ids[:3])
        return f"I found these ID details: {listed}."
    timeout_doc = next((item for item in enriched_docs if item["raw_text"] == PROCESSING_TIMEOUT_TEXT), None)
    if timeout_doc:
        return (
            f"I can see {timeout_doc['doc'].filename}, but extraction took too long and timed out. "
            "Please retry extraction or upload a clearer, smaller file."
        )

    ocr_unavailable_doc = next((item for item in enriched_docs if item["raw_text"] == OCR_UNAVAILABLE_TEXT), None)
    if ocr_unavailable_doc:
        return (
            "Your document was uploaded, but image text extraction is not available right now. "
            "If this is a PDF with selectable text, try uploading the PDF version."
        )

    missing_raw_text = all(not item["raw_text"] for item in enriched_docs)
    if missing_raw_text:
        return (
            "I can see the file was uploaded, but text was not extracted from the image yet. "
            "This usually means OCR did not initialize, so I do not have your Aadhaar number or name to read from."
        )
    return (
        "Your documents are uploaded, but extracted fields are empty right now. "
        "Try uploading a clear PDF or a better quality image."
    )


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    if not docs:
        return ChatResponse(response="You have not uploaded any documents yet. Upload a document first.")
    context = build_context(docs)
    response = answer_from_documents(req.message, context)
    if not response or "could not process your request right now" in response.lower():
        response = _local_fallback_answer(req.message, docs)
    return ChatResponse(response=response)
