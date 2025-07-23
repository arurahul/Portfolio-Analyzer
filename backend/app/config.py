import os
from datetime import timedelta

class Config:
    # Core Flask Settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback-key')
    
    # JWT Configuration (JPMC Standards)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # Database (PostgreSQL)
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300  # Recycle connections every 5 minutes
    }
    
    # Rate Limiting (Fraud Prevention)
    RATELIMIT_DEFAULT = "200 per day, 50 per hour"
    RATELIMIT_STORAGE_URI = "memory://"

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries

class ProductionConfig(Config):
    DEBUG = False
    PREFERRED_URL_SCHEME = 'https'  # Force HTTPS
    SESSION_COOKIE_SECURE = True