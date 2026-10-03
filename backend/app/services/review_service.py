from app.extensions import db
from app.models.review import Review
from app.models.college import College
from app.models.user import User

def validate_review_input(data):
    """
    Validates review payload rating and comment.
    Returns error message or None.
    """
    if not isinstance(data, dict):
        return "Validation error: Payload must be a JSON object"

    rating = data.get('rating')
    comment = data.get('comment')

    # Rating validation
    if rating is None:
        return "Validation error: Rating is required"
    try:
        rating_int = int(rating)
        if rating_int < 1 or rating_int > 5:
            return "Validation error: Rating must be an integer between 1 and 5"
    except (ValueError, TypeError):
        return "Validation error: Rating must be an integer between 1 and 5"

    # Comment validation
    if not comment or not str(comment).strip():
        return "Validation error: Comment is required"

    clean_comment = str(comment).strip()
    if len(clean_comment) < 10:
        return "Validation error: Comment must be at least 10 characters"
    if len(clean_comment) > 1000:
        return "Validation error: Comment cannot exceed 1000 characters"

    return None

def create_college_review(user_id, college_id, data):
    """
    Creates a new review for a college. (1 review per user per college limit).
    Returns (result_dict, error_message, status_code).
    """
    # Check college
    college = College.query.get(college_id)
    if not college:
        return None, "College not found", 404

    # Validate inputs
    val_error = validate_review_input(data)
    if val_error:
        return None, val_error, 400

    # One review per user per college check
    existing = Review.query.filter_by(user_id=user_id, college_id=college_id).first()
    if existing:
        return None, "You have already reviewed this college", 409

    try:
        review = Review(
            user_id=user_id,
            college_id=college_id,
            rating=int(data['rating']),
            comment=str(data['comment']).strip()
        )
        db.session.add(review)
        db.session.commit()

        return {
            "status": "success",
            "message": "Review submitted successfully",
            "data": review.to_dict()
        }, None, 201
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500

def get_college_reviews(college_id):
    """
    Retrieves all reviews and review summary for a college.
    Returns (result_dict, error_message, status_code).
    """
    college = College.query.get(college_id)
    if not college:
        return None, "College not found", 404

    reviews = Review.query.filter_by(college_id=college_id).order_by(Review.created_at.desc()).all()
    
    total_reviews = len(reviews)
    if total_reviews > 0:
        avg_rating = round(sum(r.rating for r in reviews) / total_reviews, 1)
    else:
        avg_rating = 0.0

    review_list = []
    for r in reviews:
        user = User.query.get(r.user_id)
        review_list.append({
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "user": {
                "id": user.id if user else r.user_id,
                "name": user.name if user else "Anonymous Student"
            },
            "created_at": r.created_at.isoformat() if r.created_at else None
        })

    return {
        "status": "success",
        "count": total_reviews,
        "review_summary": {
            "average_rating": avg_rating,
            "total_reviews": total_reviews
        },
        "data": review_list
    }, None, 200

def update_user_review(user_id, review_id, data):
    """
    Updates an existing review. Requires ownership.
    Returns (result_dict, error_message, status_code).
    """
    review = Review.query.get(review_id)
    if not review:
        return None, "Review not found", 404

    # Ownership check
    if review.user_id != user_id:
        return None, "You can only modify your own review", 403

    # Validate inputs
    val_error = validate_review_input(data)
    if val_error:
        return None, val_error, 400

    try:
        review.rating = int(data['rating'])
        review.comment = str(data['comment']).strip()
        db.session.commit()

        return {
            "status": "success",
            "message": "Review updated successfully",
            "data": review.to_dict()
        }, None, 200
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500

def delete_user_review(user_id, review_id):
    """
    Deletes a review. Requires ownership.
    Returns (result_dict, error_message, status_code).
    """
    review = Review.query.get(review_id)
    if not review:
        return None, "Review not found", 404

    # Ownership check
    if review.user_id != user_id:
        return None, "You can only modify your own review", 403

    try:
        db.session.delete(review)
        db.session.commit()

        return {
            "status": "success",
            "message": "Review deleted successfully"
        }, None, 200
    except Exception as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}", 500
