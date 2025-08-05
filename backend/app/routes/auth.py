from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db, limiter
from ..models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("3/minute")
def register():
    """JPMC-compliant user registration"""
    data = request.get_json()
    
    # Validation
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409
        
    try:
        new_user = User(
            email=data['email'],
            created_at=datetime.utcnow(),
            clearance=data.get('clearance', 'Intern')
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User created successfully",
            "next_step": "Please login to access your account"
        }), 201
        
    except ValueError as e:  # Password policy error
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")  # Check your terminal for this
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

@auth_bp.route('/2fa-verify', methods=['POST'])
@jwt_required()
def verify_2fa():
    data = request.get_json()
    code = data.get('code')
    if code=='123456':
        return jsonify({
            "message":"2FA verification successful",
        }),200
    else:
        return jsonify({
            "message":"Invalid 2FA code",
        }),401
        
@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5/minute")
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    # Old (Insecure)
    # if not user or not user.check_password(data.get('password')):
    
    # New (Explicit about password_hash)
    if not user.email.endswith("testemail.com"):
        return jsonify({"error": "Invalid email"}), 401
    
    if not user or not user.check_password(data['password']):  # ✅ check_password() verifies against password_hash
        if user:
            user.failed_attempts += 1
            db.session.commit()
        return jsonify({"error": "Invalid credentials"}), 401
    if user.failed_attempts>=5:
        user.is_locked=True
        db.session.commit()
        return jsonify({"error": "Account locked due to multiple failed login attempts"}), 401
        
    user.update_login_time()  # ✅ Uses the new helper method
    access_token = create_access_token(identity=user.id,
        additional_claims={
        "department": "Wealth Management",  # JPMC org unit
        "clearance": user.clearance,               # Access tier (Tier1=Admin, Tier2=Advisor)
        "location": "NYC"                   # Physical office restriction
    })
    return jsonify(access_token=access_token)

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Sample protected endpoint"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify(
        email=user.email,
        last_login=user.last_login.isoformat() if user.last_login else None
    ), 200