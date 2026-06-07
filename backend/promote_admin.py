import sys
import os

# Add the app directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User

def promote_admin(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return
        
        user.plan_type = "admin"
        db.commit()
        print(f"Success! User '{email}' has been promoted to Admin.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python promote_admin.py <email>")
        sys.exit(1)
    
    email_to_promote = sys.argv[1]
    promote_admin(email_to_promote)
