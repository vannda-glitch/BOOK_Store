# Simple notification system - can be extended
def create_notification(user_id: int, title: str, message: str, data: dict = None):
    # In production, store in database
    print(f"Notification for user {user_id}: {title} - {message}")
    return True