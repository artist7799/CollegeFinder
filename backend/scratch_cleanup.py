import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.favorite import Favorite
from app.models.review import Review

app = create_app()

def cleanup_test_data():
    with app.app_context():
        test_users = User.query.filter(
            (User.email.like('authtest_%')) |
            (User.email.like('step8_verify_%')) |
            (User.email.like('step9_%')) |
            (User.email.like('e2e_student_%'))
        ).all()

        count = len(test_users)
        for u in test_users:
            db.session.delete(u)

        db.session.commit()
        print(f"Cleaned up {count} temporary test user accounts successfully.")

if __name__ == "__main__":
    cleanup_test_data()
