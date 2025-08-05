from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

def clearance_required(required_level):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_clearance = claims.get("clearance")

            level = {
                "Intern": 1,
                "Analyst": 2,
                "Tier3": 3,
                "Tier2": 4,
                "Tier1": 5
            }

            if level.get(user_clearance, 0) < level.get(required_level, 0):
                return jsonify({"message": "Access Denied: Insufficient Clearance"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
