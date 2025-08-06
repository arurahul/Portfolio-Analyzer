import csv
from io import StringIO
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime
from ..extensions import db, limiter
from ..models import User, PortfolioRecords
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
    
    user_id=get_jwt_identity()
    records=[]
    for row in reader:
        record=PortfolioRecords(
            user_id=user_id,
            asset_name=row.get("asset_name"),
            asset_type=row.get("asset_type"),
            quantity=float(row.get("quantity",0)),
            value=float(row.get("value"),0),
        )
        records.append(record)
    try:
        db.session.bulk_save_objects(records)
        db.session.commit()
        return jsonify({"message": f"{len(records)} records uploaded successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500