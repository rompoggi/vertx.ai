# /usr/bin/python3
from flask import Blueprint, request, jsonify

from .tools.plot_functions import plot_function
from .tools.demo import demo
from .tools.agent import init_agent, run_agent

api = Blueprint("api", __name__)

PREDEFINED_REPONSE = [
    {
        "balise": "cours",
        "text": "Un électron est une particule élémentaire de charge négative.",
    },
    {
        "balise": "cours",
        "text": "La dérivée d'une fonction mesure la variation instantanée.",
    },
    {
        "balise": "cours",
        "text": "La photosynthèse est le processus par lequel les plantes produisent de l'énergie.",
    },
]

text_blocks = dict()


@api.route("/body", methods=["POST"])
def body_api():
    data = request.json
    text_blocks[data["id"]] = {"text": data["text"], "balise": data["balise"]}

    try:
        return run_agent([text_blocks[key] for key in sorted(text_blocks.keys())])
    except Exception as e:
        print("got error: ", e)
        return demo(data)


@api.route("/demo", methods=["POST"])
def demo_api():
    data = request.json
    return demo(data)


@api.route("/process", methods=["POST"])
def process_text():
    data = request.json
    input_text = data.get("text", "")
    processed_text = input_text.upper()
    return jsonify({"processed_text": processed_text})


@api.route("/plot", methods=["POST"])
def plot_api():
    try:
        data = request.json
        function_str = data.get("text", "")
        x_min = float(data.get("xMin", 0))
        x_max = float(data.get("xMax", 1))

        return plot_function(function_str, x_min, x_max)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/init", methods=["POST"])
def initialize_agent_api():
    """Initialize the agent with questionnaire data"""
    try:
        data = request.json
        print("Received questionnaire data:", data)

        # Extract user information from the frontend
        name: str = data.get("name", "")
        education_level = data.get("educationLevel", {})
        selected_subjects = data.get("selectedSubjects", [])
        selected_topics = data.get("selectedTopics", [])
        timestamp = data.get("timestamp", "")

        # Format the fixed questions for the agent
        fixed_questions = []

        # Add education level information
        if len(education_level) > 0:
            education_info = {
                "question": "What is your education level?",
                "answer": f"{education_level.get('item', '')} (index: {education_level.get('index', '')})",
                "type": "education_level",
            }
            fixed_questions.append(education_info)

        # Add selected subjects information
        if len(selected_subjects) > 0:
            subjects_info = {
                "question": "What subjects are you interested in?",
                "answer": ", ".join(
                    [
                        f"{subject.get('name', '')} (topics: {', '.join(subject.get('topics', []))})"
                        for subject in selected_subjects
                    ]
                ),
                "type": "subjects",
            }
            fixed_questions.append(subjects_info)

        # Add selected topics information
        if len(selected_topics) > 0:
            topics_info: dict[str, str] = {
                "question": "What specific topics would you like to focus on?",
                "answer": ", ".join(selected_topics),
                "type": "topics",
            }
            fixed_questions.append(topics_info)

        # Add user name if provided
        if name != "":
            name_info: dict[str, str] = {
                "question": "What is your name?",
                "answer": name,
                "type": "name",
            }
            fixed_questions.append(name_info)

        print("Fixed questions for agent:", fixed_questions)

        # Initialize the agent with the fixed questions
        # init_agent(fixed_questions)

        # Create a comprehensive response
        response_data = {
            "success": True,
            "message": "Agent initialized successfully with questionnaire data",
            "user_profile": {
                "name": name,
                "education_level": education_level,
                "selected_subjects": selected_subjects,
                "selected_topics": selected_topics,
                "timestamp": timestamp,
            },
            "agent_status": "initialized",
            "fixed_questions_count": len(fixed_questions),
            "ready_for_interaction": True,
        }

        print("Agent initialization successful")
        return jsonify(response_data)

    except Exception as e:
        print(f"Error initializing agent: {str(e)}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": f"Failed to initialize agent: {str(e)}",
                    "agent_status": "error",
                }
            ),
            500,
        )
