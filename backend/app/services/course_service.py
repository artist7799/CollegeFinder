from app.extensions import db
from app.models.college import College
from app.models.course import Course

def validate_course_data(data, is_update=False):
    """
    Validates input payload for course creation and updates.
    Returns error message string if invalid, or None if valid.
    """
    if not isinstance(data, dict):
        return "Validation error: Payload must be a JSON object"

    # Creation validations
    if not is_update:
        if not data.get('course_name') or not str(data.get('course_name')).strip():
            return "Validation error: Course name is required"
        if not data.get('degree') or not str(data.get('degree')).strip():
            return "Validation error: Degree is required"
        if not data.get('duration') or not str(data.get('duration')).strip():
            return "Validation error: Duration is required"
        if 'fees' not in data or data.get('fees') is None:
            return "Validation error: Fees is required"
    else:
        # Update validations
        if 'course_name' in data and (data['course_name'] is None or not str(data['course_name']).strip()):
            return "Validation error: Course name cannot be empty"
        if 'degree' in data and (data['degree'] is None or not str(data['degree']).strip()):
            return "Validation error: Degree cannot be empty"
        if 'duration' in data and (data['duration'] is None or not str(data['duration']).strip()):
            return "Validation error: Duration cannot be empty"

    # Fees numerical validation
    if 'fees' in data and data['fees'] is not None:
        try:
            fees = float(data['fees'])
            if fees < 0:
                return "Validation error: Fees must be greater than or equal to 0"
        except (ValueError, TypeError):
            return "Validation error: Fees must be a valid number"

    return None

def get_courses_by_college(college_id):
    """
    Retrieves all courses for a college.
    Returns (courses_list, False) if college exists, or (None, True) if college not found.
    """
    college = College.query.get(college_id)
    if not college:
        return None, True

    courses = Course.query.filter_by(college_id=college_id).order_by(Course.id.asc()).all()
    return courses, False

def get_course_by_id(course_id):
    """Retrieves a single course by its ID."""
    return Course.query.get(course_id)

def create_course(college_id, data):
    """
    Creates a new course record for a college.
    Returns (course, None, False) on success,
    (None, error_msg, False) on validation error,
    (None, None, True) if college not found.
    """
    college = College.query.get(college_id)
    if not college:
        return None, None, True

    error = validate_course_data(data, is_update=False)
    if error:
        return None, error, False

    try:
        course = Course(
            college_id=college_id,
            course_name=str(data['course_name']).strip(),
            degree=str(data['degree']).strip(),
            duration=str(data['duration']).strip(),
            fees=float(data['fees'])
        )
        db.session.add(course)
        db.session.commit()
        return course, None, False
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", False

def update_course(course_id, data):
    """
    Updates an existing course record.
    Returns (course, None, False) on success,
    (None, error_msg, False) on validation error,
    (None, None, True) if course not found.
    """
    course = Course.query.get(course_id)
    if not course:
        return None, None, True

    error = validate_course_data(data, is_update=True)
    if error:
        return None, error, False

    try:
        if 'course_name' in data:
            course.course_name = str(data['course_name']).strip()
        if 'degree' in data:
            course.degree = str(data['degree']).strip()
        if 'duration' in data:
            course.duration = str(data['duration']).strip()
        if 'fees' in data:
            course.fees = float(data['fees'])

        db.session.commit()
        return course, None, False
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", False

def delete_course(course_id):
    """
    Deletes a course by ID.
    Returns (True, False) on success, or (False, True) if course not found.
    """
    course = Course.query.get(course_id)
    if not course:
        return False, True

    try:
        db.session.delete(course)
        db.session.commit()
        return True, False
    except Exception as e:
        db.session.rollback()
        return False, False
