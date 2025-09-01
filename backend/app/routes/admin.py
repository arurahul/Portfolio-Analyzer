from flask import Blueprint,request,jsonify
from models import User,db
from utils.decorators import token_required,admin_required
from utils.auth import clearance_required
from werkzeug.security import generate_password_hash

admin_bp=Blueprint("admin",__name__)

#Get All users
@admin_bp.route("/users",method=["GET"])
@token_required
@admin_required
def getAllusers():
    users=User.query.all()
    return jsonify([{
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "is_admin": u.is_admin,
            "created_at": u.created_at
        } for u in users])

# Update user role/active status
@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@token_required
@admin_required
def update_user(current_user, user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    
    if "is_admin" in data:
        user.is_admin = data["is_admin"]
    if "is_active" in data:
        user.is_active = data["is_active"]
    
    db.session.commit()
    return jsonify({"message": "User updated successfully"})


# Deactivate user (instead of delete)
@admin_bp.route("/users/<int:user_id>/deactivate", methods=["PUT"])
@token_required
@admin_required
@clearance_required("Tier1")
def deactivate_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return jsonify({"message": f"User {user.username} deactivated"})

#Reactivate user
@admin_bp.route("/users/<int:user_id>/reactivate", methods=["PUT"])
@token_required
@admin_required
def reactivate_user(current_user,user_id):
    user=User.quer.get_or_404(user_id)
    user.is_active=True
    db.session.commit()
    return jsonify({"message": f"User {user.username} reactivated"})

#Reset Password
@admin_bp.route("/users/<int:user_id>/reset-password", methods=["PUT"])
@token_required
@admin_required
def reset_user_password(current_user, user_id):
    data = request.json
    new_password = data.get("new_password")

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user = User.query.get_or_404(user_id)
    user.password = generate_password_hash(new_password)

    db.session.commit()
    return jsonify({"message": f"Password reset for user {user.username}"})


# Delete user
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"})