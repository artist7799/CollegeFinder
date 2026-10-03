from flask import Flask, jsonify
from flask_cors import CORS
from config import DevelopmentConfig
from app.extensions import db, jwt
from app.routes import api_bp, college_bp, course_bp, placement_bp, auth_bp, favorite_bp, review_bp, admin_bp
from app.utils import register_error_handlers

def create_app(config_class=DevelopmentConfig):
    """
    Flask Application Factory
    Initializes configuration, extensions (CORS, SQLAlchemy, JWTManager), blueprints, and error handlers.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS for all origins and routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Register custom JWT error handlers
    @jwt.unauthorized_loader
    def custom_unauthorized_response(err):
        return jsonify({
            "status": "error",
            "message": "Missing or invalid authorization header"
        }), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_response(err):
        return jsonify({
            "status": "error",
            "message": "Invalid token"
        }), 401

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return jsonify({
            "status": "error",
            "message": "Token has expired"
        }), 401

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(college_bp, url_prefix='/api/colleges')
    app.register_blueprint(course_bp, url_prefix='/api')
    app.register_blueprint(placement_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(favorite_bp, url_prefix='/api/favorites')
    app.register_blueprint(review_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Register global error handlers
    register_error_handlers(app)

    return app

