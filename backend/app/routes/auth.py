import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    SendOTPRequest,
    SendOTPResponse,
    VerifyOTPRequest,
)
from app.utils.auth import create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/send-otp", response_model=SendOTPResponse)
def send_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    phone = req.phone.strip()
    if not phone or len(phone) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number.")

    user = db.query(User).filter(User.phone == phone).first()
    is_new = user is None
    if is_new:
        user = User(phone=phone)
        db.add(user)

    otp = str(random.randint(100000, 999999))
    user.otp = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
    db.commit()

    # Mock SMS — OTP is printed to the server console
    print(f"\n{'='*40}")
    print(f"  OTP for {phone}: {otp}")
    print(f"{'='*40}\n")

    return SendOTPResponse(message="OTP sent successfully.", is_new=is_new)


@router.post("/verify-otp", response_model=AuthResponse)
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == req.phone.strip()).first()
    if not user:
        raise HTTPException(status_code=400, detail="Phone number not found. Send OTP first.")
    if not user.otp or user.otp != req.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP.")
    if user.otp_expires_at and user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired. Request a new one.")

    user.otp = None
    user.otp_expires_at = None
    if req.name and req.name.strip():
        user.name = req.name.strip()
    db.commit()

    token = create_token(user.id, user.phone)
    return AuthResponse(
        token=token,
        user={"id": user.id, "phone": user.phone, "name": user.name},
    )


@router.get("/me")
def get_me(db: Session = Depends(get_db)):
    """Public endpoint — auth check is done on frontend."""
    return {"status": "ok"}
