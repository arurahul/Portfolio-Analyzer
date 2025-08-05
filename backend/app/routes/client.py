from flask import Blueprint,jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt

client_bp=Blueprint("client",__name__)

@client_bp.route("/client_data", methods=['GET'],endpoint="client_client_data")
@jwt_required
def get_client_data_client():
    identity=get_jwt_identity()
    claims=get_jwt()
    return jsonify({
        "portfolioValue": 157200.45,
        "riskScore": 3.7,
        "lastUpdated": "2025-07-29",
        "department": claims.get("department"),
        "clearance": claims.get("clearance"),
        "email": identity,
        "holdings": [
            {"id": 1, "name": "AAPL", "amount": 50},
            {"id": 2, "name": "GOOGL", "amount": 20},
            {"id": 3, "name": "TSLA", "amount": 10}
        ]
    }), 200