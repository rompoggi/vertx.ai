from flask import Flask
from flask_cors import CORS
from config import Config
from api.routes import api

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static')
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Ensure static/graphs directory exists
    # os.makedirs(os.path.join(app.static_folder, 'graphs'), exist_ok=True)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=True)
