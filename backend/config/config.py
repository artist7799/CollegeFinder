import os
from dotenv import load_dotenv

# Ensure environment variables from .env are loaded
load_dotenv()

class Config:
    """Base configuration settings."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_secure_secret_key')
    
    # Database configuration from environment variables
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL:
        # Fix legacy postgres:// schema if present from Render/Heroku
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        DB_TYPE = os.getenv('DB_TYPE', 'sqlite').lower()
        DB_HOST = os.getenv('DB_HOST', 'localhost')
        DB_PORT = os.getenv('DB_PORT', '3306')
        DB_USER = os.getenv('DB_USER', 'root')
        DB_PASSWORD = os.getenv('DB_PASSWORD', '')
        DB_NAME = os.getenv('DB_NAME', 'collegefinder')

        if DB_TYPE == 'sqlite':
            # SQLite fallback for quick testing / standalone deployment without MySQL
            sqlite_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), f"{DB_NAME}.db")
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{sqlite_db_path}"
        else:
            # Standard MySQL database connection
            password_part = f":{DB_PASSWORD}" if DB_PASSWORD else ""
            SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}{password_part}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

        
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False
