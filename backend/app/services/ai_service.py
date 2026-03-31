import json
from typing import Any, Dict, List

from groq import Groq

from app.config import settings
from app.utils.document_parser import EMPTY_FIELDS, extract_fields_locally


def _client() -> Groq:
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is missing.")
    return Groq(api_key=settings.groq_api_key)


def _chat_completion(messages: List[Dict[str, str]], temperature: float = 0.1) -> str:
    client = _client()
    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        temperature=temperature,
        messages=messages,
    )
    return response.choices[0].message.content or ""


def extract_structured_fields(raw_text: str) -> Dict[str, Any]:
    prompt = (
        "Extract structured information from this document text. Return ONLY valid JSON "
        "with keys: doc_type, name, dob, id_number, address, gender, expiry, issuer. "
        "If a field is not found, use null.\n\n"
        f"Document text:\n{raw_text}"
    )
    local_fields = extract_fields_locally(raw_text)
    try:
        content = _chat_completion(
            [
                {"role": "system", "content": "You extract document fields accurately."},
                {"role": "user", "content": prompt},
            ]
        ).strip()
        parsed = json.loads(content)
        return {**EMPTY_FIELDS, **local_fields, **parsed}
    except Exception:
        # Fall back to local pattern extraction when AI is unavailable.
        return local_fields


def answer_from_documents(question: str, document_context: str) -> str:
    system_prompt = (
        "You are a personal document assistant. Answer questions using only the user's "
        "stored documents. Be concise and direct."
    )
    user_prompt = f"{document_context}\n\nUser question: {question}"
    try:
        return _chat_completion(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
    except Exception:
        return "I could not process your request right now. Please try again."
