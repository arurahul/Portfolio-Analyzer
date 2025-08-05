from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime
from ..extensions import db, limiter
from ..models import User
from ..utils.auth import clearance_required

portfolio_bp=Blueprint("portfolio","__name__")

@portfolio_bp.route("/client_data", methods=['GET'],endpoint="portfolio_client_data")
@jwt_required
def get_portfolio_client_data():
    claims=get_jwt()
    if claims.get("department")!="Wealth Department":
        return jsonify({"message":"Unautorixed Department"}),403
    return jsonify({"data":"Confidential client portfolio"})

@portfolio_bp.route("/system-setting", methods=['POST'])
@jwt_required
@clearance_required("Tier 1") #Only Tier 1 gets the access
def system_settings():
    claims = get_jwt()
    if claims.get("clearance") != "Tier1":
        return jsonify({"message": "Admin Access Required"}), 403
    return jsonify({"data": "System Settings"})