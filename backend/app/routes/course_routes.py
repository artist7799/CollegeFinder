from flask import Blueprint, request, jsonify
from app.services.course_service import (
    get_courses_by_college,
    get_course_by_id,
    create_course,
    update_course,
    delete_course
)

course_bp = Blueprint('courses', __name__)

@course_bp.route('/colleges/<int:college_id>/courses', methods=['GET'])
def get_college_courses(college_id):
    """
    GET /api/colleges/<college_id>/courses
    Returns all courses for the specified college.
    """
    courses, college_not_found = get_courses_by_college(college_id)
    if college_not_found:
        return jsonify({
            "status": "error",
            "message": "College not found"
        }), 404

    return jsonify({
        "status": "success",
        "count": len(courses),
        "data": [course.to_dict() for course in courses]
    }), 200

@course_bp.route('/colleges/<int:college_id>/courses', methods=['POST'])
def add_course_to_college(college_id):
    """
    POST /api/colleges/<college_id>/courses
    Creates a new course for the specified college.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    course, error, college_not_found = create_course(college_id, data)
    if college_not_found:
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
        "message": "Course created successfully",
        "data": course.to_dict()
    }), 201

@course_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_single_course(course_id):
    """
    GET /api/courses/<course_id>
    Returns details for a single course.
    """
    course = get_course_by_id(course_id)
    if not course:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": course.to_dict()
    }), 200

@course_bp.route('/courses/<int:course_id>', methods=['PUT'])
def edit_course(course_id):
    """
    PUT /api/courses/<course_id>
    Updates an existing course by ID.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "status": "error",
            "message": "Validation error: Invalid or missing JSON body"
        }), 400

    course, error, course_not_found = update_course(course_id, data)
    if course_not_found:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    if error:
        return jsonify({
            "status": "error",
            "message": error
        }), 400

    return jsonify({
        "status": "success",
        "message": "Course updated successfully",
        "data": course.to_dict()
    }), 200

@course_bp.route('/courses/<int:course_id>', methods=['DELETE'])
def remove_course(course_id):
    """
    DELETE /api/courses/<course_id>
    Deletes a course by ID.
    """
    success, course_not_found = delete_course(course_id)
    if course_not_found:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    if not success:
        return jsonify({
            "status": "error",
            "message": "Failed to delete course"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Course deleted successfully"
    }), 200
