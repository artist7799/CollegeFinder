from app.extensions import db
from app.models.college import College
from app.models.placement import Placement

def validate_placement_data(data, is_update=False, existing_placement=None):
    """
    Validates input payload for placement creation and updates.
    Returns error message string if invalid, or None if valid.
    """
    if not isinstance(data, dict):
        return "Validation error: Payload must be a JSON object"

    # Required fields for creation
    if not is_update:
        if 'average_package' not in data or data.get('average_package') is None:
            return "Validation error: Average package is required"
        if 'highest_package' not in data or data.get('highest_package') is None:
            return "Validation error: Highest package is required"
        if 'placement_percentage' not in data or data.get('placement_percentage') is None:
            return "Validation error: Placement percentage is required"
        if not data.get('recruiting_companies') or not str(data.get('recruiting_companies')).strip():
            return "Validation error: Recruiting companies cannot be empty"

    # Average package numeric validation
    avg_pkg = None
    if 'average_package' in data and data['average_package'] is not None:
        try:
            avg_pkg = float(data['average_package'])
            if avg_pkg < 0:
                return "Validation error: Average package must be greater than or equal to 0"
        except (ValueError, TypeError):
            return "Validation error: Average package must be a valid number"
    elif existing_placement:
        avg_pkg = existing_placement.average_package

    # Highest package numeric validation
    high_pkg = None
    if 'highest_package' in data and data['highest_package'] is not None:
        try:
            high_pkg = float(data['highest_package'])
            if high_pkg < 0:
                return "Validation error: Highest package must be greater than or equal to 0"
        except (ValueError, TypeError):
            return "Validation error: Highest package must be a valid number"
    elif existing_placement:
        high_pkg = existing_placement.highest_package

    # Package comparison: Highest package should not be lower than average package
    if avg_pkg is not None and high_pkg is not None:
        if high_pkg < avg_pkg:
            return "Validation error: Highest package cannot be lower than average package"

    # Placement percentage validation
    if 'placement_percentage' in data and data['placement_percentage'] is not None:
        try:
            pct = float(data['placement_percentage'])
            if pct < 0 or pct > 100:
                return "Validation error: Placement percentage must be between 0 and 100"
        except (ValueError, TypeError):
            return "Validation error: Placement percentage must be a valid number between 0 and 100"

    # Recruiting companies validation for update
    if is_update and 'recruiting_companies' in data:
        if data['recruiting_companies'] is None or not str(data['recruiting_companies']).strip():
            return "Validation error: Recruiting companies cannot be empty"

    return None

def get_placement_by_college(college_id):
    """
    Retrieves placement record for a college.
    Returns (placement, college_not_found, placement_not_found).
    """
    college = College.query.get(college_id)
    if not college:
        return None, True, True

    placement = Placement.query.filter_by(college_id=college_id).first()
    if not placement:
        return None, False, True

    return placement, False, False

def create_placement(college_id, data):
    """
    Creates placement record for a college.
    Returns (placement, error_msg, college_not_found, already_exists).
    """
    college = College.query.get(college_id)
    if not college:
        return None, None, True, False

    # Check if placement already exists for this college
    existing = Placement.query.filter_by(college_id=college_id).first()
    if existing:
        return None, "Placement record already exists for this college. Use PUT to update.", False, True

    error = validate_placement_data(data, is_update=False)
    if error:
        return None, error, False, False

    try:
        placement = Placement(
            college_id=college_id,
            average_package=float(data['average_package']),
            highest_package=float(data['highest_package']),
            placement_percentage=float(data['placement_percentage']),
            recruiting_companies=str(data['recruiting_companies']).strip()
        )
        db.session.add(placement)
        db.session.commit()
        return placement, None, False, False
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", False, False

def update_placement(placement_id, data):
    """
    Updates an existing placement record by placement_id.
    Returns (placement, error_msg, placement_not_found).
    """
    placement = Placement.query.get(placement_id)
    if not placement:
        return None, None, True

    error = validate_placement_data(data, is_update=True, existing_placement=placement)
    if error:
        return None, error, False

    try:
        if 'average_package' in data:
            placement.average_package = float(data['average_package'])
        if 'highest_package' in data:
            placement.highest_package = float(data['highest_package'])
        if 'placement_percentage' in data:
            placement.placement_percentage = float(data['placement_percentage'])
        if 'recruiting_companies' in data:
            placement.recruiting_companies = str(data['recruiting_companies']).strip()

        db.session.commit()
        return placement, None, False
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", False

def delete_placement(placement_id):
    """
    Deletes a placement record by placement_id.
    Returns (True, False) on success, or (False, True) if placement not found.
    """
    placement = Placement.query.get(placement_id)
    if not placement:
        return False, True

    try:
        db.session.delete(placement)
        db.session.commit()
        return True, False
    except Exception as e:
        db.session.rollback()
        return False, False
