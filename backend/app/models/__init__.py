from app.extensions import db
from app.models.user import User
from app.models.college import College
from app.models.course import Course
from app.models.placement import Placement
from app.models.review import Review
from app.models.favorite import Favorite

__all__ = [
    'db',
    'User',
    'College',
    'Course',
    'Placement',
    'Review',
    'Favorite'
]
