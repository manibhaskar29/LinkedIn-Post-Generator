import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

# Gmail SMTP Configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")


def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP via email using Gmail SMTP"""
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your LinkedIn Post Generator OTP"
        message["From"] = FROM_EMAIL
        message["To"] = to_email

        # HTML email body
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #0077b5; margin-bottom: 20px;">LinkedIn Post Generator</h2>
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                        Your verification code is:
                    </p>
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #0077b5; font-size: 36px; letter-spacing: 5px; margin: 0;">
                            {otp}
                        </h1>
                    </div>
                    <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                        This code will expire in <strong>5 minutes</strong>.
                    </p>
                    <p style="font-size: 14px; color: #666;">
                        If you didn't request this code, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        © 2026 LinkedIn Post Generator. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """

        # Attach HTML to message
        part = MIMEText(html, "html")
        message.attach(part)

        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, message.as_string())

        print(f"✅ OTP sent successfully to {to_email}")
        return True

    except Exception as e:
        print(f"❌ Failed to send otp: {str(e)}")
        return False
