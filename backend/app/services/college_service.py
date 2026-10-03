import math
from datetime import datetime
from sqlalchemy import or_, asc, desc
from app.extensions import db
from app.models.college import College
from app.models.course import Course

def validate_college_data(data, is_update=False):
    """
    Validates input data for college creation and updates.
    Returns error message string if invalid, or None if valid.
    """
    if not isinstance(data, dict):
        return "Validation error: Payload must be a JSON object"

    # Required fields check for creation
    if not is_update:
        if not data.get('name') or not str(data.get('name')).strip():
            return "Validation error: Name is required"
        if not data.get('city') or not str(data.get('city')).strip():
            return "Validation error: City is required"
        if not data.get('state') or not str(data.get('state')).strip():
            return "Validation error: State is required"
    else:
        # For updates, if required fields are provided, they must not be empty
        if 'name' in data and (data['name'] is None or not str(data['name']).strip()):
            return "Validation error: Name cannot be empty"
        if 'city' in data and (data['city'] is None or not str(data['city']).strip()):
            return "Validation error: City cannot be empty"
        if 'state' in data and (data['state'] is None or not str(data['state']).strip()):
            return "Validation error: State cannot be empty"

    # Rating validation
    if 'rating' in data and data['rating'] is not None:
        try:
            rating = float(data['rating'])
            if rating < 0 or rating > 5:
                return "Validation error: Rating must be between 0 and 5"
        except (ValueError, TypeError):
            return "Validation error: Rating must be a number between 0 and 5"

    # Established year validation
    if 'established_year' in data and data['established_year'] is not None:
        try:
            year = int(data['established_year'])
            current_year = datetime.now().year
            if year < 1800 or year > current_year + 1:
                return "Validation error: Invalid established year"
        except (ValueError, TypeError):
            return "Validation error: Established year must be a valid integer"

    return None

def parse_and_validate_query_params(args):
    """
    Parses and validates query parameters for searching, filtering, sorting, and pagination.
    Returns (params_dict, error_message).
    """
    params = {}

    # Search & Text Filters
    params['q'] = args.get('q', '').strip() or None
    params['state'] = args.get('state', '').strip() or None
    params['city'] = args.get('city', '').strip() or None
    params['college_type'] = args.get('college_type', '').strip() or None
    params['university'] = args.get('university', '').strip() or None

    # Min Rating Filter
    min_rating_str = args.get('min_rating')
    if min_rating_str is not None and min_rating_str.strip() != '':
        try:
            min_rating = float(min_rating_str)
            if min_rating < 0 or min_rating > 5:
                return None, "Min rating must be between 0 and 5"
            params['min_rating'] = min_rating
        except (ValueError, TypeError):
            return None, "Min rating must be a valid number between 0 and 5"
    else:
        params['min_rating'] = None

    # Max Fees Filter
    max_fees_str = args.get('max_fees')
    if max_fees_str is not None and max_fees_str.strip() != '':
        try:
            max_fees = float(max_fees_str)
            if max_fees < 0:
                return None, "Max fees cannot be negative"
            params['max_fees'] = max_fees
        except (ValueError, TypeError):
            return None, "Max fees must be a valid number"
    else:
        params['max_fees'] = None

    # Sorting Parameters
    sort_by = args.get('sort_by', 'name').strip().lower()
    allowed_sort_fields = ['name', 'rating', 'established_year']
    if sort_by not in allowed_sort_fields:
        return None, f"Invalid sort_by field. Supported fields: {', '.join(allowed_sort_fields)}"
    params['sort_by'] = sort_by

    sort_order = args.get('sort_order', 'asc').strip().lower()
    allowed_sort_orders = ['asc', 'desc']
    if sort_order not in allowed_sort_orders:
        return None, f"Invalid sort_order parameter. Supported values: {', '.join(allowed_sort_orders)}"
    params['sort_order'] = sort_order

    # Pagination Parameters
    page_str = args.get('page', '1')
    try:
        page = int(page_str)
        if page < 1:
            return None, "Page must be a valid integer"
        params['page'] = page
    except (ValueError, TypeError):
        return None, "Page must be a valid integer"

    per_page_str = args.get('per_page', '10')
    try:
        per_page = int(per_page_str)
        if per_page < 1:
            return None, "Per page must be a valid integer"
        if per_page > 50:
            return None, "Per page cannot exceed 50"
        params['per_page'] = per_page
    except (ValueError, TypeError):
        return None, "Per page must be a valid integer"

    return params, None

def get_colleges_paginated(params):
    """
    Queries colleges applying search, filters, sorting, and pagination.
    Returns response dictionary payload.
    """
    query = db.session.query(College)

    # 1. Course Fee Filter (Join Course model)
    if params.get('max_fees') is not None:
        query = query.join(College.courses).filter(Course.fees <= params['max_fees']).distinct()

    # 2. General Search 'q' (Name, City, State, University, Course Name)
    q = params.get('q')
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                College.name.ilike(search_pattern),
                College.city.ilike(search_pattern),
                College.state.ilike(search_pattern),
                College.university.ilike(search_pattern),
                College.courses.any(Course.course_name.ilike(search_pattern))
            )
        )

    # 3. Exact/Partial Filters
    if params.get('state'):
        query = query.filter(College.state.ilike(params['state']))
    if params.get('city'):
        query = query.filter(College.city.ilike(params['city']))
    if params.get('college_type'):
        query = query.filter(College.college_type.ilike(params['college_type']))
    if params.get('university'):
        query = query.filter(College.university.ilike(params['university']))
    if params.get('min_rating') is not None:
        query = query.filter(College.rating >= params['min_rating'])

    # 4. Total Count Calculation
    total_count = query.count()

    # 5. Sorting
    sort_by = params.get('sort_by', 'name')
    sort_order = params.get('sort_order', 'asc')
    sort_column = getattr(College, sort_by, College.name)

    if sort_order == 'desc':
        query = query.order_by(desc(sort_column), desc(College.id))
    else:
        query = query.order_by(asc(sort_column), asc(College.id))

    # 6. Pagination
    page = params['page']
    per_page = params['per_page']
    total_pages = math.ceil(total_count / per_page) if total_count > 0 else 0

    if page > total_pages and total_count > 0:
        items = []
        count = 0
    else:
        offset_val = (page - 1) * per_page
        items = query.offset(offset_val).limit(per_page).all()
        count = len(items)

    return {
        "status": "success",
        "count": count,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total": total_count,
        "data": [item.to_dict() for item in items]
    }

def get_filter_options():
    """
    Returns available distinct filter choices (states, cities, college_types, universities)
    sorted alphabetically.
    """
    states = [r[0] for r in db.session.query(College.state).filter(College.state.isnot(None), College.state != '').distinct().all() if r[0]]
    cities = [r[0] for r in db.session.query(College.city).filter(College.city.isnot(None), College.city != '').distinct().all() if r[0]]
    college_types = [r[0] for r in db.session.query(College.college_type).filter(College.college_type.isnot(None), College.college_type != '').distinct().all() if r[0]]
    universities = [r[0] for r in db.session.query(College.university).filter(College.university.isnot(None), College.university != '').distinct().all() if r[0]]

    return {
        "status": "success",
        "data": {
            "states": sorted(list(set(states))),
            "cities": sorted(list(set(cities))),
            "college_types": sorted(list(set(college_types))),
            "universities": sorted(list(set(universities)))
        }
    }

def get_all_colleges():
    """Returns a list of all colleges in the database."""
    return College.query.order_by(College.id.desc()).all()

def get_college_by_id(college_id):
    """Retrieves a single college by its ID."""
    return College.query.get(college_id)

def create_college(data):
    """
    Creates a new college entity.
    Returns (College, None) on success or (None, error_message) on failure.
    """
    error = validate_college_data(data, is_update=False)
    if error:
        return None, error

    try:
        college = College(
            name=str(data.get('name')).strip(),
            city=str(data.get('city')).strip(),
            state=str(data.get('state')).strip(),
            description=data.get('description', '').strip() if data.get('description') else None,
            address=data.get('address', '').strip() if data.get('address') else None,
            college_type=data.get('college_type', '').strip() if data.get('college_type') else None,
            university=data.get('university', '').strip() if data.get('university') else None,
            established_year=int(data['established_year']) if data.get('established_year') is not None else None,
            website=data.get('website', '').strip() if data.get('website') else None,
            email=data.get('email', '').strip() if data.get('email') else None,
            phone=data.get('phone', '').strip() if data.get('phone') else None,
            logo=data.get('logo', '').strip() if data.get('logo') else None,
            rating=float(data['rating']) if data.get('rating') is not None else 0.0
        )
        db.session.add(college)
        db.session.commit()
        return college, None
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"

def update_college(college_id, data):
    """
    Updates an existing college entity.
    Returns (College, None, False) on success,
    (None, error_msg, False) on validation error,
    (None, None, True) if college not found.
    """
    college = College.query.get(college_id)
    if not college:
        return None, None, True

    error = validate_college_data(data, is_update=True)
    if error:
        return None, error, False

    try:
        if 'name' in data:
            college.name = str(data['name']).strip()
        if 'city' in data:
            college.city = str(data['city']).strip()
        if 'state' in data:
            college.state = str(data['state']).strip()
        if 'description' in data:
            college.description = data['description'].strip() if data['description'] else None
        if 'address' in data:
            college.address = data['address'].strip() if data['address'] else None
        if 'college_type' in data:
            college.college_type = data['college_type'].strip() if data['college_type'] else None
        if 'university' in data:
            college.university = data['university'].strip() if data['university'] else None
        if 'established_year' in data:
            college.established_year = int(data['established_year']) if data['established_year'] is not None else None
        if 'website' in data:
            college.website = data['website'].strip() if data['website'] else None
        if 'email' in data:
            college.email = data['email'].strip() if data['email'] else None
        if 'phone' in data:
            college.phone = data['phone'].strip() if data['phone'] else None
        if 'logo' in data:
            college.logo = data['logo'].strip() if data['logo'] else None
        if 'rating' in data:
            college.rating = float(data['rating']) if data['rating'] is not None else 0.0

        db.session.commit()
        return college, None, False
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", False

def delete_college(college_id):
    """
    Deletes a college by ID.
    Returns (True, False) on success,
    (False, True) if college not found,
    (False, False) on database error.
    """
    college = College.query.get(college_id)
    if not college:
        return False, True

    try:
        db.session.delete(college)
        db.session.commit()
        return True, False
    except Exception as e:
        db.session.rollback()
        return False, False
