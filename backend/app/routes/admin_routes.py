from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.auth_service import admin_required
from app.services.admin_service import (
    get_dashboard_summary,
    get_admin_users,
    update_user_role,
    get_admin_reviews,
    remove_admin_review
)
from app.services.college_service import (
    parse_and_validate_query_params,
    get_colleges_paginated,
    create_college,
    update_college,
    delete_college
)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def get_dashboard():
    """
    GET /api/admin/dashboard
    Returns summary statistics for admin dashboard. (Requires Admin JWT).
    """
    res, error, status_code = get_dashboard_summary()
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    """
    GET /api/admin/users
    Returns paginated user accounts. Supports ?page=&per_page=&search=. (Requires Admin JWT).
    """
    res, error, status_code = get_admin_users(request.args)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
@admin_required
def change_role(user_id):
    """
    PUT /api/admin/users/<user_id>/role
    Updates user role to 'student' or 'admin'. (Requires Admin JWT).
    """
    data = request.get_json(silent=True)
    if data is None or 'role' not in data:
        return jsonify({"status": "error", "message": "Validation error: Role is required"}), 400

    res, error, status_code = update_user_role(user_id, data.get('role'))
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@admin_bp.route('/colleges', methods=['GET'])
@jwt_required()
@admin_required
def get_colleges_admin():
    """
    GET /api/admin/colleges
    Returns paginated colleges for administration. (Requires Admin JWT).
    """
    params, error = parse_and_validate_query_params(request.args)
    if error:
        return jsonify({"status": "error", "message": error}), 400

    response_payload = get_colleges_paginated(params)
    return jsonify(response_payload), 200

@admin_bp.route('/colleges', methods=['POST'])
@jwt_required()
@admin_required
def add_college_admin():
    """
    POST /api/admin/colleges
    Creates a new college entity. (Requires Admin JWT).
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"status": "error", "message": "Validation error: Invalid or missing JSON body"}), 400

    college, error = create_college(data)
    if error:
        return jsonify({"status": "error", "message": error}), 400

    return jsonify({
        "status": "success",
        "message": "College created successfully",
        "data": college.to_dict(include_relations=True)
    }), 201

@admin_bp.route('/colleges/<int:college_id>', methods=['PUT'])
@jwt_required()
@admin_required
def edit_college_admin(college_id):
    """
    PUT /api/admin/colleges/<college_id>
    Updates an existing college entity. (Requires Admin JWT).
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"status": "error", "message": "Validation error: Invalid or missing JSON body"}), 400

    college, error, not_found = update_college(college_id, data)
    if not_found:
        return jsonify({"status": "error", "message": "College not found"}), 404

    if error:
        return jsonify({"status": "error", "message": error}), 400

    return jsonify({
        "status": "success",
        "message": "College updated successfully",
        "data": college.to_dict(include_relations=True)
    }), 200

@admin_bp.route('/colleges/<int:college_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def remove_college_admin(college_id):
    """
    DELETE /api/admin/colleges/<college_id>
    Deletes a college safely. (Requires Admin JWT).
    """
    success, not_found = delete_college(college_id)
    if not_found:
        return jsonify({"status": "error", "message": "College not found"}), 404

    if not success:
        return jsonify({"status": "error", "message": "Failed to delete college"}), 500

    return jsonify({
        "status": "success",
        "message": "College deleted successfully"
    }), 200

@admin_bp.route('/reviews', methods=['GET'])
@jwt_required()
@admin_required
def get_reviews_admin():
    """
    GET /api/admin/reviews
    Returns paginated reviews for moderation. (Requires Admin JWT).
    """
    res, error, status_code = get_admin_reviews(request.args)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code

@admin_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def remove_review_admin(review_id):
    """
    DELETE /api/admin/reviews/<review_id>
    Deletes a review by ID. (Requires Admin JWT).
    """
    res, error, status_code = remove_admin_review(review_id)
    if error:
        return jsonify({"status": "error", "message": error}), status_code
    return jsonify(res), status_code
