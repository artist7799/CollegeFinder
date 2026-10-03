from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth_service import (
    register_user,
    authenticate_user,
    get_current_user_profile
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    POST /api/auth/register
    Registers a new user (default role='student').
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    user_data, error, status_code = register_user(data)
    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), status_code

    return jsonify({
        "status": "success",
        "message": "Registration successful",
        "data": user_data
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    Authenticates user and returns JWT token.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    auth_data, error, status_code = authenticate_user(data)
    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), status_code

    return jsonify({
        "status": "success",
        "message": "Login successful",
        "data": auth_data
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """
    GET /api/auth/me
    Returns authenticated user profile. Requires JWT.
    """
    current_user_id = get_jwt_identity()
    user_data, error, status_code = get_current_user_profile(current_user_id)
    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), status_code

    return jsonify({
        "status": "success",
        "data": user_data
    }), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected_test():
    """
    GET /api/auth/protected
    Simple protected endpoint test requiring JWT.
    """
    return jsonify({
        "status": "success",
        "message": "Authenticated request successful"
    }), 200
