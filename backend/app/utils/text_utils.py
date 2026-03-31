from typing import Iterable


def compact_text(text: str) -> str:
    if not text:
        return ""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)


def join_chunks(chunks: Iterable[str]) -> str:
    return compact_text("\n".join(chunk for chunk in chunks if chunk))
