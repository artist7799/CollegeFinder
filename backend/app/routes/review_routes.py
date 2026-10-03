from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.review_service import (
    create_college_review,
    get_college_reviews,
    update_user_review,
    delete_user_review
)

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/colleges/<int:college_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(college_id):
    """
    POST /api/colleges/<college_id>/reviews
    Submits a review for a college (Requires JWT).
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"status": "error", "message": "Validation error: Invalid or missing JSON body"}), 400

    res, error, status_code = create_college_review(user_id, college_id, data)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@review_bp.route('/colleges/<int:college_id>/reviews', methods=['GET'])
def fetch_reviews(college_id):
    """
    GET /api/colleges/<college_id>/reviews
    Fetches all reviews and review summary for a college (Public).
    """
    res, error, status_code = get_college_reviews(college_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@review_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def edit_review(review_id):
    """
    PUT /api/reviews/<review_id>
    Updates an existing review (Requires JWT + Ownership).
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"status": "error", "message": "Validation error: Invalid or missing JSON body"}), 400

    res, error, status_code = update_user_review(user_id, review_id, data)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@review_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def remove_review(review_id):
    """
    DELETE /api/reviews/<review_id>
    Deletes an existing review (Requires JWT + Ownership).
    """
    user_id = int(get_jwt_identity())
    res, error, status_code = delete_user_review(user_id, review_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code
