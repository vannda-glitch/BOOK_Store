import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = "noreply@bookstore.com"
    msg['To'] = to_email
    
    html_part = MIMEText(body, 'html')
    msg.attach(html_part)
    
    # For demo purposes - in production, configure SMTP
    # with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
    #     server.starttls()
    #     server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
    #     server.send_message(msg)
    
    return True