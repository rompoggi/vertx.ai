# /usr/bin/python3
from flask import Flask
from flask_cors import CORS
from api.routes import api
from os import path, getenv
import dotenv

dotenv.load_dotenv()
api_key: str = getenv("API_KEY", "")
if api_key == "":  # api_key should be globally defined TODO
    try:
        with open(
            path.join(path.dirname(__file__), "storage", "api_key.txt"), "r"
        ) as f:
            api_key = f.read().strip()
    except:
        print(
            "No file 'storage/api_key.txt', please create such a file (soon deprecated) or create a .env in /backend folder and add a '.env' file."
        )


class Config:
    API_KEY = api_key

    CORS_ORIGINS = ["http://localhost:3000"]  # React default port

    # API configuration
    API_TITLE = "Agents Workflow"
    API_VERSION = "v1"


def create_app(config_class=Config):
    app = Flask(__name__, static_folder="static")
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # Register blueprints
    app.register_blueprint(api, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)
