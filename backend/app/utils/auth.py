from functools import wraps
from flask_jwt_extended import get_jwt
from flask import jsonify

def clearance_required(level):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_clearance = claims.get("clearance", "")
            if user_clearance != level:
                return jsonify({"message": "Admin/Tier 1 access required"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
