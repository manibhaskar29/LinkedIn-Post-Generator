import random
from datetime import datetime, timedelta
from typing import Optional, Dict

# In-memory OTP storage
# Structure: {email: {"otp": "123456", "expires": datetime, "attempts": 0}}
otp_store: Dict[str, dict] = {}

# Resend tracking
# Structure: {email: [timestamp1, timestamp2, ...]}
resend_attempts: Dict[str, list] = {}

OTP_EXPIRY_MINUTES = 5
MAX_RESEND_PER_HOUR = 3


def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))


def store_otp(email: str, otp: str) -> None:
    """Store OTP with expiration time"""
    otp_store[email] = {
        "otp": otp,
        "expires": datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
        "attempts": 0
    }
    print(f"📝 OTP stored for {email}: {otp} (expires in {OTP_EXPIRY_MINUTES} min)")


def verify_otp(email: str, otp: str) -> tuple[bool, str]:
    """
    Verify OTP for email
    Returns: (success: bool, message: str)
    """
    # Check if OTP exists
    if email not in otp_store:
        return False, "No OTP found for this email. Please request a new one."

    stored_data = otp_store[email]

    # Check expiration
    if datetime.utcnow() > stored_data["expires"]:
        del otp_store[email]
        return False, "OTP has expired. Please request a new one."

    # Check attempts (max 3 wrong attempts)
    if stored_data["attempts"] >= 3:
        del otp_store[email]
        return False, "Too many incorrect attempts. Please request a new OTP."

    # Verify OTP
    if stored_data["otp"] != otp:
        stored_data["attempts"] += 1
        return False, f"Invalid OTP. {3 - stored_data['attempts']} attempts remaining."

    # Success - delete OTP (one-time use)
    del otp_store[email]
    print(f"✅ OTP verified successfully for {email}")
    return True, "OTP verified successfully"


def can_resend_otp(email: str) -> tuple[bool, str]:
    """
    Check if user can request another OTP (rate limiting)
    Returns: (can_resend: bool, message: str)
    """
    now = datetime.utcnow()
    one_hour_ago = now - timedelta(hours=1)

    # Initialize if not exists
    if email not in resend_attempts:
        resend_attempts[email] = []

    # Clean up old attempts (older than 1 hour)
    resend_attempts[email] = [
        timestamp for timestamp in resend_attempts[email]
        if timestamp > one_hour_ago
    ]

    # Check limit
    if len(resend_attempts[email]) >= MAX_RESEND_PER_HOUR:
        return False, f"Maximum {MAX_RESEND_PER_HOUR} OTP requests per hour. Please try again later."

    # Record this attempt
    resend_attempts[email].append(now)
    return True, "OK"


def cleanup_expired_otps() -> None:
    """Remove expired OTPs from storage (call periodically)"""
    now = datetime.utcnow()
    expired_emails = [
        email for email, data in otp_store.items()
        if data["expires"] < now
    ]

    for email in expired_emails:
        del otp_store[email]

    if expired_emails:
        print(f"🧹 Cleaned up {len(expired_emails)} expired OTPs")
