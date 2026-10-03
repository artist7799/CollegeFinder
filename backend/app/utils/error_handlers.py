from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError

def register_error_handlers(app):
    """
    Registers global HTTP and Database error handlers.
    """
    
    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({
            "status": "error",
            "message": "Bad Request: " + str(error.description if hasattr(error, 'description') else error)
        }), 400

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            "status": "error",
            "message": "Resource not found"
        }), 404

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({
            "status": "error",
            "message": "Method not allowed"
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500

    @app.errorhandler(SQLAlchemyError)
    def database_error(error):
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(error)
        }), 500
