from typing import Any, Dict, Optional

from pydantic import BaseModel


class SendOTPRequest(BaseModel):
    phone: str


class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    phone: str
    name: Optional[str] = None


class AuthResponse(BaseModel):
    token: str
    user: Dict[str, Any]


class SendOTPResponse(BaseModel):
    message: str
    is_new: bool
