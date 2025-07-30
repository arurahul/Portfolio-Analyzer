from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime
from ..extensions import db, limiter
from ..models import User

portfolio_bp=Blueprint("portfolio","__name__")

@portfolio_bp.route("/client_data", methods=['GET'])
@jwt_required
def get_client_data():
    claims=get_jwt()
    if claims.get("department")!="Wealth Department":
        return jsonify({"message":"Unautorixed Department"}),403
    return jsonify({"data":"Confidential client portfolio"})

@portfolio_bp.route("/system-setting", methods=['POST'])
@jwt_required
def system_settings():
    claims = get_jwt()
    if claims.get("clearance") != "Tier1":
        return jsonify({"message": "Admin Access Required"}), 403
    return jsonify({"data": "System Settings"})