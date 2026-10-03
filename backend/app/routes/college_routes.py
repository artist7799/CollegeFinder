from flask import Blueprint, request, jsonify
from app.services.college_service import (
    get_colleges_paginated,
    get_filter_options,
    get_college_by_id,
    create_college,
    update_college,
    delete_college,
    parse_and_validate_query_params
)

college_bp = Blueprint('colleges', __name__)

@college_bp.route('', methods=['GET'])
@college_bp.route('/', methods=['GET'])
def get_colleges():
    """
    GET /api/colleges
    Supports query parameters for search, filtering, sorting, and pagination.
    """
    params, error = parse_and_validate_query_params(request.args)
    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    response_payload = get_colleges_paginated(params)
    return jsonify(response_payload), 200

@college_bp.route('/filters', methods=['GET'])
def get_filters():
    """
    GET /api/colleges/filters
    Returns unique available filter values for states, cities, college_types, and universities.
    """
    options = get_filter_options()
    return jsonify(options), 200

@college_bp.route('/<int:college_id>', methods=['GET'])
def get_college(college_id):
    """
    GET /api/colleges/<id>
    Returns single college details by ID, including nested courses and placement information.
    """
    college = get_college_by_id(college_id)
    if not college:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": college.to_dict(include_relations=True)
    }), 200

@college_bp.route('', methods=['POST'])
@college_bp.route('/', methods=['POST'])
def add_college():
    """
    POST /api/colleges
    Creates a new college.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    college, error = create_college(data)
    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    return jsonify({
        "status": "success",
        "message": "College created successfully",
        "data": college.to_dict(include_relations=True)
    }), 201

@college_bp.route('/<int:college_id>', methods=['PUT'])
def edit_college(college_id):
    """
    PUT /api/colleges/<id>
    Updates an existing college by ID.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    college, error, not_found = update_college(college_id, data)
    if not_found:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    return jsonify({
        "status": "success",
        "message": "College updated successfully",
        "data": college.to_dict(include_relations=True)
    }), 200

@college_bp.route('/<int:college_id>', methods=['DELETE'])
def remove_college(college_id):
    """
    DELETE /api/colleges/<id>
    Deletes a college by ID.
    """
    success, not_found = delete_college(college_id)
    if not_found:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    if not success:
        return jsonify({
            "status": "error",
            "message": "Failed to delete college"
        }), 500

    return jsonify({
        "status": "success",
        "message": "College deleted successfully"
    }), 200
