import re
from functools import wraps
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity
from app.extensions import db
from app.models.user import User

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def validate_email_format(email):
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def register_user(data):
    """
    Validates input and creates a new student user.
    Returns (user_dict, error_message, status_code).
    """
    if not isinstance(data, dict):
        return None, "Validation error: Payload must be a JSON object", 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # 1. Name validation
    if not name or not str(name).strip():
        return None, "Validation error: Name is required", 400

    # 2. Email validation
    if not email or not str(email).strip():
        return None, "Validation error: Email is required", 400

    clean_email = str(email).strip().lower()
    if not validate_email_format(clean_email):
        return None, "Validation error: Invalid email format", 400

    # 3. Password validation
    if not password or not str(password).strip():
        return None, "Validation error: Password is required", 400

    if len(str(password)) < 8:
        return None, "Validation error: Password must be at least 8 characters", 400

    # 4. Email uniqueness check
    existing_user = User.query.filter_by(email=clean_email).first()
    if existing_user:
        return None, "Email already registered", 400

    # 5. Create user (Enforce role='student')
    try:
        hashed_password = generate_password_hash(str(password))
        new_user = User(
            name=str(name).strip(),
            email=clean_email,
            password=hashed_password,
            role='student'  # ALWAYS default to student
        )
        db.session.add(new_user)
        db.session.commit()

        user_data = {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
        return user_data, None, 201

    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500

def authenticate_user(data):
    """
    Verifies user credentials and generates access token.
    Returns (result_dict, error_message, status_code).
    """
    if not isinstance(data, dict):
        return None, "Validation error: Payload must be a JSON object", 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return None, "Invalid email or password", 401

    clean_email = str(email).strip().lower()
    user = User.query.filter_by(email=clean_email).first()

    # Do not reveal whether email exists for security
    if not user or not check_password_hash(user.password, str(password)):
        return None, "Invalid email or password", 401

    # Generate JWT Token (identity stored as string user.id)
    access_token = create_access_token(identity=str(user.id))

    return {
        "user": user.to_dict(),
        "access_token": access_token
    }, None, 200

def get_current_user_profile(user_id_str):
    """
    Fetches user profile by user_id string from JWT identity.
    Returns (user_dict, error_message, status_code).
    """
    try:
        user_id = int(user_id_str)
        user = User.query.get(user_id)
        if not user:
            return None, "User not found", 404
        return user.to_dict(), None, 200
    except (ValueError, TypeError):
        return None, "Invalid user token identity", 400

def admin_required(fn):
    """
    Reusable decorator for admin role enforcement on protected endpoints.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 401

        user = User.query.get(int(current_user_id))
        if not user or user.role != 'admin':
            return jsonify({"status": "error", "message": "Admin privileges required"}), 403

        return fn(*args, **kwargs)
    return wrapper
