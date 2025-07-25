from flask import Flask
from .extensions import db, jwt, limiter,migrate
import os
from .config import DevelopmentConfig,ProductionConfig
from datetime import timedelta


def create_app(config_class=DevelopmentConfig):
    
    app=Flask(__name__)
    #PA=Portfolio Analyzer
    # Security Configurations 
    app.config.from_object(config_class)

    # Initialize Security Extensions
    db.init_app(app)
    migrate.init_app(app,db)
    jwt.init_app(app)
    limiter.init_app(app)
        
    # Layer Imports
    from .models import User
    from .routes.auth import auth_bp
    from .routes.portfolio import portfolio_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(portfolio_bp,url_prefix="/api")
    return app