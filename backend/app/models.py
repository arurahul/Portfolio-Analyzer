from werkzeug.security import generate_password_hash,check_password_hash
from .extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(255),nullable=False,unique=True)
    password_hash = db.Column(db.String(255), nullable=False)  # Never store plaintext!
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Audit: Registration time
    clearance=db.Column(db.String(50),default="Intern")
    department=db.Column(db.String(50),default="")
    last_login = db.Column(db.DateTime)  # Audit: Last successful login
    last_activity = db.Column(db.DateTime)  # For session timeout
    failed_attempts = db.Column(db.Integer, default=0)  # Security: Brute force protection
    is_active = db.Column(db.Boolean, default=True)  # For account deactivation
    is_admin = db.Column(db.Boolean, default=False)
    is_locked=db.Column(db.Boolean,default=False)

    # JPMC Password Policy (Minimum 10 chars, 1 upper, 1 digit, 1 special)
    def set_password(self, password):
        if len(password) < 10:
            raise ValueError("Password must be at least 10 characters")
        if not any(c.isupper() for c in password):
            raise ValueError("Password must contain 1 uppercase letter")
        if not any(c.isdigit() for c in password):
            raise ValueError("Password must contain 1 digit")
        if not any(c in '!@#$%^&*()' for c in password):
            raise ValueError("Password must contain 1 special character")
        
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256:600000')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def update_login_time(self):
        """Call this on successful login"""
        self.last_login = datetime.utcnow()
        self.failed_attempts = 0  # Reset counter
        db.session.add(self)
        try:
            db.session.commit()
        except:
            db.session.rollback()
            raise

    def __repr__(self):
        return f'<User {self.email}>'

class PortfolioRecords(db.Model):
    __tablename__ = 'portfolio_records'
    id=db.Column(db.Integer,primary_key=True,nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    asset_name = db.Column(db.String(255), nullable=False)
    asset_type = db.Column(db.String(100))
    quantity = db.Column(db.Float)
    value = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user=db.relationship('User',backref="portfolio_records")