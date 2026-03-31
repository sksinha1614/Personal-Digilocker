import base64
import json
from typing import Any, Dict
from pathlib import Path

from app.services.ai_service import extract_structured_fields, _client
from app.services.ocr_service import extract_text

OCR_UNAVAILABLE_TEXT = "[[OCR_UNAVAILABLE]]"
PROCESSING_TIMEOUT_TEXT = "[[PROCESSING_TIMEOUT]]"


def process_document(file_path: str) -> Dict[str, Any]:
    raw_text = extract_text(file_path)
    fields = extract_structured_fields(raw_text)

    # HYBRID FALLBACK: If core fields (id_number or name) are missing, use Vision API
    if (fields.get("id_number") is None or fields.get("name") is None) and file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        print("Local extraction incomplete. Triggering Groq Vision Fallback...")
        try:
            with open(file_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
            client = _client()
            response = client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": "Extract structured information from this Indian ID card. Output only valid JSON with exact keys: 'doc_type', 'name', 'dob', 'id_number', 'address', 'gender', 'expiry', 'issuer'. If any field is missing or not visible, use null."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{encoded_string}",
                                },
                            }
                        ]
                    }
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content or ""
            parsed = json.loads(content.strip())
            
            # Merge missing fields
            for k, v in parsed.items():
                if v is not None and (fields.get(k) is None or str(fields.get(k)).strip() == ""):
                    fields[k] = v
                    
            print("Vision Fallback successful!")
        except Exception as e:
            print(f"Vision Fallback failed: {e}")

    return {"raw_text": raw_text, "fields": fields}
