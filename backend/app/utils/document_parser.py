import re
from typing import Any, Dict, Iterable

from app.utils.text_utils import compact_text


EMPTY_FIELDS: Dict[str, Any] = {
    "doc_type": None,
    "name": None,
    "dob": None,
    "id_number": None,
    "address": None,
    "gender": None,
    "expiry": None,
    "issuer": None,
}


def _first_match(patterns: Iterable[str], text: str, flags: int = 0) -> str | None:
    for pattern in patterns:
        match = re.search(pattern, text, flags)
        if match:
            return compact_text(match.group(1) if match.groups() else match.group(0))
    return None


def _guess_name(lines: list[str]) -> str | None:
    skip_tokens = (
        "government of india",
        "govt. of india",
        "unique identification authority of india",
        "year of birth",
        "dob",
        "male",
        "female",
        "address",
        "aadhaar",
        "enrolment",
        "vid",
        "download date",
    )
    for index, line in enumerate(lines):
        lower = line.lower()
        if "government of india" in lower or "govt. of india" in lower:
            for next_line in lines[index + 1 : index + 4]:
                candidate = next_line.strip()
                words = candidate.split()
                candidate_lower = candidate.lower()
                if (
                    len(words) >= 2
                    and candidate == candidate.title()
                    and not any(token in candidate_lower for token in skip_tokens)
                    and not re.search(r"\d", candidate)
                ):
                    return candidate
    return None


def extract_fields_locally(raw_text: str) -> Dict[str, Any]:
    text = compact_text(raw_text)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    lower_text = text.lower()
    fields = dict(EMPTY_FIELDS)

    aadhaar_id = _first_match(
        [
            r"\b(\d{4}\s\d{4}\s\d{4})\b",
            r"\b(\d{12})\b",
        ],
        text,
    )
    pan_id = _first_match([r"\b([A-Z]{5}\d{4}[A-Z])\b"], text)

    if "aadhaar" in lower_text or "government of india" in lower_text or aadhaar_id:
        fields["doc_type"] = "Aadhaar"
        fields["issuer"] = "UIDAI"
        fields["id_number"] = aadhaar_id
        fields["name"] = _guess_name(lines)
    elif "income tax department" in lower_text or pan_id:
        fields["doc_type"] = "PAN"
        fields["issuer"] = "Income Tax Department"
        fields["id_number"] = pan_id
        fields["name"] = _first_match([r"name\s*[:\-]?\s*([A-Z][A-Z\s]{2,})"], text, re.IGNORECASE)

    fields["dob"] = _first_match(
        [
            r"\bDOB\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
            r"\bYear of Birth\s*[:\-]?\s*(\d{4})\b",
            r"\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
        ],
        text,
        re.IGNORECASE,
    )
    fields["gender"] = _first_match([r"\b(Male|Female|Transgender)\b"], text, re.IGNORECASE)
    fields["address"] = _first_match([r"Address\s*[:\-]?\s*(.+)"], text, re.IGNORECASE)

    if fields["gender"]:
        fields["gender"] = fields["gender"].title()

    return fields
