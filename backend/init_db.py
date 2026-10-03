import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db
from app.models import User, College, Course, Placement, Review, Favorite  # Ensure models are imported

def create_database_if_not_exists():
    """
    Ensures MySQL database exists if using MySQL mode.
    """
    db_type = os.getenv('DB_TYPE', 'mysql').lower()
    
    if db_type == 'sqlite':
        print("[INFO] Using SQLite database mode.")
        return True

    host = os.getenv('DB_HOST', 'localhost')
    port = int(os.getenv('DB_PORT', 3306))
    user = os.getenv('DB_USER', 'root')
    password = os.getenv('DB_PASSWORD', '')
    db_name = os.getenv('DB_NAME', 'collegefinder')

    print(f"[INFO] Checking MySQL connection at {host}:{port} for user '{user}'...")

    try:
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"[SUCCESS] MySQL Database '{db_name}' verified / created successfully.")
        connection.close()
        return True
    except Exception as e:
        print(f"[ERROR] Failed to connect to MySQL server: {e}")
        print("\n[TROUBLESHOOTING TIPS]")
        print(" 1. Ensure your MySQL server (MySQL Workbench, XAMPP, or MySQL Service) is running.")
        print(" 2. Open 'backend/.env' and update DB_PASSWORD with your actual MySQL password.")
        print(" 3. Or, set 'DB_TYPE=sqlite' in '.env' to run locally with SQLite without MySQL.")
        return False

def init_database():
    """
    Creates all SQLAlchemy database tables within Flask app context.
    """
    if not create_database_if_not_exists():
        print("[WARNING] Skipping SQLAlchemy table creation due to DB connection issue.")
        return False

    app = create_app()
    with app.app_context():
        print("[INFO] Creating database tables using SQLAlchemy...")
        try:
            db.create_all()
            print("[SUCCESS] All tables created successfully!")
            print("   - users")
            print("   - colleges")
            print("   - courses")
            print("   - placements")
            print("   - reviews")
            print("   - favorites")
            return True
        except Exception as e:
            print(f"[ERROR] Error creating database tables: {e}")
            return False

if __name__ == '__main__':
    print("=" * 60)
    print("[INIT] Starting CollegeFinder Database Initialization Process")
    print("=" * 60)
    success = init_database()
    if success:
        print("[SUCCESS] Database initialization completed successfully!")
    print("=" * 60)
