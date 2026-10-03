from app.routes.api import api_bp
from app.routes.college_routes import college_bp
from app.routes.course_routes import course_bp
from app.routes.placement_routes import placement_bp
from app.routes.auth_routes import auth_bp
from app.routes.favorite_routes import favorite_bp
from app.routes.review_routes import review_bp
from app.routes.admin_routes import admin_bp

__all__ = ['api_bp', 'college_bp', 'course_bp', 'placement_bp', 'auth_bp', 'favorite_bp', 'review_bp', 'admin_bp']
