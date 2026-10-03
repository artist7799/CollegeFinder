import math
from sqlalchemy import or_
from app.extensions import db
from app.models.user import User
from app.models.college import College
from app.models.course import Course
from app.models.review import Review
from app.models.favorite import Favorite

def get_dashboard_summary():
    """
    Returns summary statistics for the admin dashboard.
    """
    total_users = db.session.query(User).count()
    total_colleges = db.session.query(College).count()
    total_courses = db.session.query(Course).count()
    total_reviews = db.session.query(Review).count()
    total_favorites = db.session.query(Favorite).count()

    return {
        "status": "success",
        "data": {
            "total_users": total_users,
            "total_colleges": total_colleges,
            "total_courses": total_courses,
            "total_reviews": total_reviews,
            "total_favorites": total_favorites
        }
    }, None, 200

def get_admin_users(args):
    """
    Retrieves paginated user accounts with optional search by name or email.
    NEVER returns password or password_hash.
    """
    query = db.session.query(User)

    search = args.get('search', '').strip()
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                User.name.ilike(search_pattern),
                User.email.ilike(search_pattern)
            )
        )

    total_count = query.count()

    # Pagination
    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    if page < 1:
        page = 1
    if per_page < 1 or per_page > 50:
        per_page = 10

    total_pages = math.ceil(total_count / per_page) if total_count > 0 else 0
    offset_val = (page - 1) * per_page

    users = query.order_by(User.id.desc()).offset(offset_val).limit(per_page).all()

    return {
        "status": "success",
        "count": len(users),
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total": total_count,
        "data": [u.to_dict() for u in users]
    }, None, 200

def update_user_role(user_id, role):
    """
    Updates a user's role. Allowed roles: 'student', 'admin'.
    """
    allowed_roles = ['student', 'admin']
    if not role or str(role).strip().lower() not in allowed_roles:
        return None, "Validation error: Invalid role. Allowed roles are 'student' and 'admin'", 400

    new_role = str(role).strip().lower()
    user = User.query.get(user_id)
    if not user:
        return None, "User not found", 404

    try:
        user.role = new_role
        db.session.commit()
        return {
            "status": "success",
            "message": f"User role updated to {new_role}",
            "data": user.to_dict()
        }, None, 200
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500

def get_admin_reviews(args):
    """
    Retrieves paginated reviews for administration/moderation.
    """
    query = db.session.query(Review)
    total_count = query.count()

    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    if page < 1:
        page = 1
    if per_page < 1 or per_page > 50:
        per_page = 10

    total_pages = math.ceil(total_count / per_page) if total_count > 0 else 0
    offset_val = (page - 1) * per_page

    reviews = query.order_by(Review.created_at.desc()).offset(offset_val).limit(per_page).all()

    data = []
    for r in reviews:
        college = College.query.get(r.college_id)
        user = User.query.get(r.user_id)
        data.append({
            "id": r.id,
            "college_id": r.college_id,
            "college_name": college.name if college else "Unknown College",
            "user_id": r.user_id,
            "user_name": user.name if user else "Unknown User",
            "user_email": user.email if user else "N/A",
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })

    return {
        "status": "success",
        "count": len(data),
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total": total_count,
        "data": data
    }, None, 200

def remove_admin_review(review_id):
    """
    Safely deletes a review by ID.
    """
    review = Review.query.get(review_id)
    if not review:
        return None, "Review not found", 404

    try:
        db.session.delete(review)
        db.session.commit()
        return {
            "status": "success",
            "message": "Review deleted successfully by administrator"
        }, None, 200
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500
