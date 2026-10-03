from flask import Blueprint, request, jsonify
from app.services.placement_service import (
    get_placement_by_college,
    create_placement,
    update_placement,
    delete_placement
)

placement_bp = Blueprint('placements', __name__)

@placement_bp.route('/colleges/<int:college_id>/placement', methods=['GET'])
def get_college_placement(college_id):
    """
    GET /api/colleges/<college_id>/placement
    Returns placement information for the specified college.
    """
    placement, college_not_found, placement_not_found = get_placement_by_college(college_id)
    if college_not_found:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    if placement_not_found:
        return jsonify({
            "status": "error",
            "message": "Placement information not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": placement.to_dict()
    }), 200

@placement_bp.route('/colleges/<int:college_id>/placement', methods=['POST'])
def add_placement_to_college(college_id):
    """
    POST /api/colleges/<college_id>/placement
    Creates placement information for the specified college.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    placement, error, college_not_found, already_exists = create_placement(college_id, data)
    if college_not_found:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    if already_exists or error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    return jsonify({
        "status": "success",
        "message": "Placement information created successfully",
        "data": placement.to_dict()
    }), 201

@placement_bp.route('/placements/<int:placement_id>', methods=['PUT'])
def edit_placement(placement_id):
    """
    PUT /api/placements/<placement_id>
    Updates an existing placement record by placement_id.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    placement, error, placement_not_found = update_placement(placement_id, data)
    if placement_not_found:
        return jsonify({
            "status": "error",
            "message": "Placement information not found"
        }), 404

    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    return jsonify({
        "status": "success",
        "message": "Placement information updated successfully",
        "data": placement.to_dict()
    }), 200

@placement_bp.route('/placements/<int:placement_id>', methods=['DELETE'])
def remove_placement(placement_id):
    """
    DELETE /api/placements/<placement_id>
    Deletes a placement record by placement_id.
    """
    success, placement_not_found = delete_placement(placement_id)
    if placement_not_found:
        return jsonify({
            "status": "error",
            "message": "Placement information not found"
        }), 404

    if not success:
        return jsonify({
            "status": "error",
            "message": "Failed to delete placement information"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Placement information deleted successfully"
    }), 200
