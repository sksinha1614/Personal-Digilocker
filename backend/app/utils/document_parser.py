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


def _extract_name(text: str, lines: list[str]) -> str | None:
    """Extract name with multiple strategies for different ID types."""
    # Strategy 1: Explicit "Name:" label (Aadhaar, Voter ID, PAN, etc.)
    name_match = re.search(
        r"(?:^|\n)\s*Name\s*[:\-\.]\s*([A-Z][A-Za-z\s\.]{2,40})",
        text,
        re.IGNORECASE | re.MULTILINE,
    )
    if name_match:
        candidate = name_match.group(1).strip()
        # Remove trailing labels like "DOB" or "Gender"
        candidate = re.split(r"\b(?:DOB|Gender|Date|Address|Father|Mother)\b", candidate, flags=re.IGNORECASE)[0].strip()
        if len(candidate.split()) >= 2:
            return candidate

    # Strategy 2: For PAN — the line right after "INCOME TAX DEPARTMENT" or before the date
    lower_text = text.lower()
    if "income tax department" in lower_text:
        for i, line in enumerate(lines):
            if "income tax" in line.lower() and i + 1 < len(lines):
                # Check subsequent lines for a name-like pattern
                for next_line in lines[i + 1 : i + 4]:
                    candidate = next_line.strip()
                    if (
                        re.match(r"^[A-Z][A-Z\s\.]{3,}$", candidate)
                        and not re.search(r"\d", candidate)
                        and "GOVT" not in candidate
                        and "DEPARTMENT" not in candidate
                        and "PERMANENT" not in candidate
                        and "ACCOUNT" not in candidate
                        and "SIGNATURE" not in candidate
                    ):
                        return candidate.strip()

    # Strategy 3: For Aadhaar — look after "Government of India" header
    for i, line in enumerate(lines):
        lower = line.lower()
        if "government of india" in lower or "govt" in lower:
            for next_line in lines[i + 1 : i + 5]:
                candidate = next_line.strip()
                words = candidate.split()
                candidate_lower = candidate.lower()
                skip_words = (
                    "government", "india", "unique", "identification",
                    "authority", "year", "dob", "male", "female",
                    "address", "aadhaar", "enrolment", "vid", "download",
                    "election", "commission", "epic",
                )
                if (
                    len(words) >= 2
                    and not any(w in candidate_lower for w in skip_words)
                    and not re.search(r"\d", candidate)
                    and re.match(r"^[A-Z][A-Za-z\s\.]+$", candidate)
                ):
                    return candidate

    return None


def _extract_gender(text: str) -> str | None:
    """Extract gender with support for abbreviations like M/F."""
    # Full words
    match = re.search(r"\b(Male|Female|Transgender)\b", text, re.IGNORECASE)
    if match:
        return match.group(1).title()

    # Abbreviated: "Gender: M" or "(Gender: M)"
    match = re.search(r"Gender\s*[:\-]?\s*\(?([MF])\)?", text, re.IGNORECASE)
    if match:
        code = match.group(1).upper()
        return "Male" if code == "M" else "Female"

    # Standalone after "MALE" in various formats
    match = re.search(r"\bMALE\b", text)
    if match:
        return "Male"
    match = re.search(r"\bFEMALE\b", text)
    if match:
        return "Female"

    return None


def extract_fields_locally(raw_text: str) -> Dict[str, Any]:
    text = compact_text(raw_text)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    lower_text = text.lower()
    fields = dict(EMPTY_FIELDS)

    # ── ID number detection ───────────────────────────
    aadhaar_id = _first_match(
        [
            r"\b(\d{4}\s\d{4}\s\d{4})\b",
            r"\b(\d{12})\b",
        ],
        text,
    )
    pan_id = _first_match([r"\b([A-Z]{5}\d{4}[A-Z])\b"], text)
    epic_id = _first_match([r"EPIC\s*(?:No)?\.?\s*[:\-]?\s*([A-Z]{3}\d{7})"], text, re.IGNORECASE)
    if not epic_id:
        epic_id = _first_match([r"\b([A-Z]{3}\d{7})\b"], text)

    # ── Doc type classification ───────────────────────
    if "election commission" in lower_text or "epic" in lower_text or "voter" in lower_text:
        fields["doc_type"] = "Voter ID"
        fields["issuer"] = "Election Commission of India"
        fields["id_number"] = epic_id
    elif "aadhaar" in lower_text or ("government of india" in lower_text and aadhaar_id):
        fields["doc_type"] = "Aadhaar"
        fields["issuer"] = "UIDAI"
        fields["id_number"] = aadhaar_id
    elif "income tax department" in lower_text or pan_id:
        fields["doc_type"] = "PAN"
        fields["issuer"] = "Income Tax Department"
        fields["id_number"] = pan_id
    elif "passport" in lower_text:
        fields["doc_type"] = "Passport"
        fields["issuer"] = "Ministry of External Affairs"
    elif aadhaar_id:
        fields["doc_type"] = "Aadhaar"
        fields["issuer"] = "UIDAI"
        fields["id_number"] = aadhaar_id

    # ── Name ──────────────────────────────────────────
    fields["name"] = _extract_name(text, lines)

    # ── DOB ───────────────────────────────────────────
    fields["dob"] = _first_match(
        [
            r"\bDOB\s*[:\-\/]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
            r"\bDOB/AGE\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
            r"\bDate\s+of\s+Birth\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
            r"\bYear of Birth\s*[:\-]?\s*(\d{4})\b",
            r"\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b",
        ],
        text,
        re.IGNORECASE,
    )

    # ── Gender ────────────────────────────────────────
    fields["gender"] = _extract_gender(text)

    # ── Address ───────────────────────────────────────
    addr = _first_match(
        [
            r"Address\s*[:\-]?\s*(.+?)(?:\n|$)",
        ],
        text,
        re.IGNORECASE,
    )
    if addr:
        # Try to get multi-line address
        addr_match = re.search(r"Address\s*[:\-]?\s*(.+)", text, re.IGNORECASE | re.DOTALL)
        if addr_match:
            full_addr = addr_match.group(1).strip()
            # Cut off at next field label
            full_addr = re.split(
                r"\n\s*(?:Gender|DOB|Name|EPIC|Phone|Mobile|Aadhaar)",
                full_addr,
                flags=re.IGNORECASE,
            )[0].strip()
            addr_lines = [l.strip() for l in full_addr.splitlines() if l.strip()]
            fields["address"] = ", ".join(addr_lines[:3])
        else:
            fields["address"] = addr

    # ── Father's Name (for Voter ID context) ──────────
    fathers_name = _first_match(
        [r"Father'?s?\s*Name\s*[:\-]?\s*([A-Z][A-Za-z\s\.]{2,40})"],
        text,
        re.IGNORECASE,
    )

    return fields
