import json
from typing import Any, Dict, List, Optional

from groq import Groq

from app.config import settings
from app.utils.document_parser import EMPTY_FIELDS, extract_fields_locally


def _client() -> Groq:
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is missing.")
    return Groq(api_key=settings.groq_api_key)


def _chat_completion(messages: List[Dict[str, str]], temperature: float = 0.1, response_format: Optional[Dict[str, str]] = None) -> str:
    client = _client()
    kwargs = {
        "model": "llama-3.3-70b-versatile",
        "temperature": temperature,
        "messages": messages,
    }
    if response_format:
        kwargs["response_format"] = response_format
        
    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content or ""


def extract_structured_fields(raw_text: str) -> Dict[str, Any]:
    prompt = (
        "Extract structured information from this Indian document text (like PAN, Aadhaar, Voter ID, Passport, etc.). Output must be a valid JSON object "
        "with the exact exact keys: 'doc_type', 'name', 'dob', 'id_number', 'address', 'gender', 'expiry', 'issuer'.\n"
        "Rules:\n"
        "1. name: Extract the Full Name accurately. Ignore title words like 'Name', 'Father', 'Mother'. For PAN cards, the name is usually directly below 'INCOME TAX DEPARTMENT' or 'GOVT. OF INDIA'.\n"
        "2. gender: Only output 'Male', 'Female', 'Transgender', or null.\n"
        "3. id_number: Extract the core ID strictly (e.g. 12 numeric digits for Aadhaar, 10 alphanumeric for PAN).\n"
        "4. dob: Ensure format is DD/MM/YYYY if found.\n"
        "If any field or information is missing, accurately use null.\n\n"
        f"Document raw text to process:\n{raw_text}"
    )
    local_fields = extract_fields_locally(raw_text)
    try:
        content = _chat_completion(
            messages=[
                {"role": "system", "content": "You are a precise data extraction API. You always reply in valid JSON format."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"}
        ).strip()
        parsed = json.loads(content)
        return {**EMPTY_FIELDS, **local_fields, **parsed}
    except Exception as e:
        print(f"AI Extraction Exception: {e}")
        # Fall back to local pattern extraction when AI is unavailable or parsing fails.
        return local_fields


def answer_from_documents(question: str, document_context: str) -> str:
    system_prompt = (
        "You are an expert personal document assistant. Your singular goal is to accurately answer questions "
        "based strictly on the user's stored documents provided below. Be extremely concise, direct, and factual. "
        "If the answer is not present in the documents, state clearly: 'The requested information is not available in your stored documents.' Do not hallucinate."
    )
    # Clip large document contexts to avoid going over limits unnecessarily.
    max_context_length = 50000 
    clipped_context = document_context[:max_context_length]
    
    user_prompt = f"Here is the data from the user's stored documents:\n---\n{clipped_context}\n---\n\nUser question: {question}"
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
