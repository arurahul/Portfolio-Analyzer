import csv
from io import StringIO
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime
from ..extensions import db, limiter
from ..models import User, PortfolioRecords
from ..utils.auth import clearance_required
from ..schemas.portfolio_schemas import PortfoliosRecordSchema
from ..services.portfolio_service import PortfolioService



portfolio_bp = Blueprint("portfolio", __name__)
portfolio_schema = PortfoliosRecordSchema(many=True)


# -------------------- CLIENT: Get own portfolio data --------------------
@portfolio_bp.route("/client_data", methods=['GET'], endpoint="portfolio_client_data")
@jwt_required()
def get_portfolio_client_data():
    claims = get_jwt()
    if claims.get("department") != "Wealth Department":
        return jsonify({"message": "Unauthorized Department"}), 403

    user_id = claims.get("sub")
    records = PortfolioService.get_records_by_user(user_id)
    return jsonify({"data": portfolio_schema.dump(records)})


# -------------------- ADMIN: Get all portfolio data --------------------
@portfolio_bp.route("/portfolio_records", methods=['GET'], endpoint="portfolio_records")
@jwt_required()
@clearance_required("Tier 1")
def get_portfolio_records():
    claims = get_jwt()
    if claims.get("clearance") != "Tier 1":
        return jsonify({"message": "Admin Access Required"}), 403

    records = PortfolioService.get_all_records()
    return jsonify({"data": portfolio_schema.dump(records)})


# -------------------- ADMIN: System settings --------------------
@portfolio_bp.route("/system-setting", methods=['POST'])
@jwt_required()
@clearance_required("Tier 1")
def system_settings():
    return jsonify({"data": "System Settings"})


# -------------------- Upload CSV (Client) --------------------
@portfolio_bp.route("/upload-csv", methods=["POST"])
@jwt_required()
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files allowed"}), 400
    
    stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
    reader = csv.DictReader(stream)
    
    user_id = get_jwt_identity()
    records = []
    for row in reader:
        records.append(PortfolioService.create_record_from_row(row, user_id))

    try:
        PortfolioService.add_records(records)
        return jsonify({"message": f"{len(records)} records uploaded successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500