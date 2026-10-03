from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.favorite_service import (
    add_college_favorite,
    get_user_favorites,
    check_college_favorite,
    remove_college_favorite
)

favorite_bp = Blueprint('favorites', __name__)

@favorite_bp.route('/<int:college_id>', methods=['POST'])
@jwt_required()
def add_favorite(college_id):
    """
    POST /api/favorites/<college_id>
    Adds college to authenticated user's favorites.
    """
    user_id = int(get_jwt_identity())
    res, error, status_code = add_college_favorite(user_id, college_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@favorite_bp.route('', methods=['GET'])
@favorite_bp.route('/', methods=['GET'])
@jwt_required()
def get_favorites():
    """
    GET /api/favorites
    Retrieves all favorites of the authenticated user.
    """
    user_id = int(get_jwt_identity())
    res, error, status_code = get_user_favorites(user_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@favorite_bp.route('/check/<int:college_id>', methods=['GET'])
@jwt_required()
def check_favorite(college_id):
    """
    GET /api/favorites/check/<college_id>
    Checks if a college is favorited by the authenticated user.
    """
    user_id = int(get_jwt_identity())
    res, error, status_code = check_college_favorite(user_id, college_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@favorite_bp.route('/<int:college_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(college_id):
    """
    DELETE /api/favorites/<college_id>
    Removes college from authenticated user's favorites.
    """
    user_id = int(get_jwt_identity())
    res, error, status_code = remove_college_favorite(user_id, college_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code
