import re

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    pattern = r'^\+?[0-9]{8,15}$'
    return bool(re.match(pattern, phone))

def validate_isbn(isbn: str) -> bool:
    isbn = isbn.replace('-', '').replace(' ', '')
    if not isbn.isdigit():
        return False
    return len(isbn) in [10, 13]