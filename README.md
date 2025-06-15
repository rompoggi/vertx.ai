# Basic Web Docker Project

This is a full-stack web application with a React frontend and Python Flask backend.

## Prerequisites

- Python 3.x
- Node.js and npm
- Docker and Docker Compose (optional, for containerized deployment)

## Project Structure

```
.
├── backend/         # Python Flask backend
│   ├── api/        # API endpoints
│   ├── static/     # Static files
│   └── app.py      # Main application file
└── frontend/       # React frontend
    ├── src/        # Source files
    └── public/     # Public assets
```

## Running the Application

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows, use: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```bash
   python app.py
   ```
   The backend server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000

## Development

- Backend API endpoints are available at http://localhost:5000/api
- Frontend development server supports hot-reloading
- Backend supports auto-reloading during development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
