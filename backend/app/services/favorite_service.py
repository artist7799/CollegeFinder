from app.extensions import db
from app.models.favorite import Favorite
from app.models.college import College

def add_college_favorite(user_id, college_id):
    """
    Adds a college to user's favorites.
    Returns (result_dict, error_message, status_code).
    """
    # Check if college exists
    college = College.query.get(college_id)
    if not college:
        return None, "College not found", 404

    # Check if already favorited
    existing = Favorite.query.filter_by(user_id=user_id, college_id=college_id).first()
    if existing:
        return None, "College already in favorites", 409

    try:
        fav = Favorite(user_id=user_id, college_id=college_id)
        db.session.add(fav)
        db.session.commit()

        return {"status": "success", "message": "College added to favorites"}, None, 201
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500

def get_user_favorites(user_id):
    """
    Retrieves all favorites for the authenticated user.
    Returns (result_dict, error_message, status_code).
    """
    favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
    
    data = []
    for fav in favorites:
        college = College.query.get(fav.college_id)
        if college:
            data.append({
                "id": fav.id,
                "college": {
                    "id": college.id,
                    "name": college.name,
                    "city": college.city,
                    "state": college.state,
                    "college_type": college.college_type,
                    "university": college.university,
                    "rating": college.rating,
                    "logo": college.logo
                },
                "created_at": fav.created_at.isoformat() if fav.created_at else None
            })

    return {
        "status": "success",
        "count": len(data),
        "data": data
    }, None, 200

def check_college_favorite(user_id, college_id):
    """
    Checks if a specific college is favorited by the user.
    Returns (result_dict, error_message, status_code).
    """
    existing = Favorite.query.filter_by(user_id=user_id, college_id=college_id).first()
    return {
        "status": "success",
        "is_favorite": bool(existing)
    }, None, 200

def remove_college_favorite(user_id, college_id):
    """
    Removes a college from user's favorites.
    Returns (result_dict, error_message, status_code).
    """
    fav = Favorite.query.filter_by(user_id=user_id, college_id=college_id).first()
    if not fav:
        return None, "Favorite not found", 404

    try:
        db.session.delete(fav)
        db.session.commit()
        return {"status": "success", "message": "College removed from favorites"}, None, 200
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500
