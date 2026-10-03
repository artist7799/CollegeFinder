from flask import Blueprint, jsonify
from sqlalchemy import text
from app.extensions import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint returning system status.
    """
    return jsonify({
        "status": "success",
        "message": "CollegeFinder API is running"
    }), 200

@api_bp.route('/health/db', methods=['GET'])
def db_health_check():
    """
    Database connection health check endpoint.
    """
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({
            "status": "success",
            "message": "Database connection is healthy"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Database connection failed",
            "details": str(e)
        }), 500
