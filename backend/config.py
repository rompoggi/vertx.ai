import os

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # CORS configuration
    CORS_ORIGINS = ['http://localhost:3000']  # React default port
    
    # API configuration
    API_TITLE = 'Text Processing API'
    API_VERSION = 'v1' 