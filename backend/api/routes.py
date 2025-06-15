import matplotlib
matplotlib.use('Agg')  # Must be set before importing pyplot
import matplotlib.pyplot as plt
from flask import Blueprint, request, jsonify, send_file, current_app
import numpy as np
import io
import re
import os
from datetime import datetime
import base64
import math
from tools.agent import run_agent

api = Blueprint('api', __name__)

text_blocks = dict()

@api.route('/body', methods=['POST'])
def body_function():
    data = request.json

    text_blocks[data['id']] = {"content": data['text'], "balise": data['balise']}

    return jsonify(run_agent(text_blocks))

@api.route('/process', methods=['POST'])
def process_text():
    data = request.json
    print("Received data:", data)  # Debug print
    input_text = data.get('text', '')
    # Process the text (e.g., convert to uppercase)
    processed_text = input_text.upper()
    return jsonify({'processed_text': processed_text})

@api.route('/plot', methods=['POST'])
def plot_function():
    try:
        data = request.json
        function_str = data.get('function', '')
        x_min = float(data.get('xMin', 0))
        x_max = float(data.get('xMax', 1))
        
        # Validate x range
        if x_min >= x_max:
            return jsonify({'error': 'x_min must be less than x_max'}), 400
        
        # Extract the right-hand side of the equation
        match = re.search(r'f\(x\)\s*=\s*(.+)', function_str)
        if not match:
            return jsonify({'error': 'Invalid function format. Use f(x) = ...'}), 400
        
        expr = match.group(1).strip()
        
        # Create x values
        x = np.linspace(x_min, x_max, 1000)
        
        # Create a new figure with a dark background
        plt.style.use('dark_background')
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Replace common math operations with numpy equivalents
        expr = expr.replace('^', '**')
        
        # Create evaluation context with mathematical functions and constants
        eval_context = {
            'np': np,
            'x': x,
            'sin': np.sin,
            'cos': np.cos,
            'tan': np.tan,
            'exp': np.exp,
            'log': np.log10,  # Base 10 logarithm
            'ln': np.log,     # Natural logarithm (base e)
            'sqrt': np.sqrt,
            'pi': np.pi,
            'e': np.e,
            'abs': np.abs,
            'arcsin': np.arcsin,
            'arccos': np.arccos,
            'arctan': np.arctan,
            'sinh': np.sinh,
            'cosh': np.cosh,
            'tanh': np.tanh,
        }
        
        # Evaluate the function
        try:
            y = eval(expr, eval_context)
        except Exception as e:
            return jsonify({'error': f'Error evaluating function: {str(e)}'}), 400
        
        # Plot the function
        ax.plot(x, y, color='#FFD246', linewidth=2)
        
        # Add x=0 and y=0 lines
        ax.axhline(y=0, color='skyblue', linestyle='-', linewidth=1, alpha=0.8)
        ax.axvline(x=0, color='skyblue', linestyle='-', linewidth=1, alpha=0.8)
        
        # Customize the plot
        ax.grid(True, alpha=0.2, linestyle='--')
        ax.set_title('Function Plot', color='white')
        ax.set_xlabel('x', color='white')
        ax.set_ylabel('f(x)', color='white')
        
        # Set the background color
        fig.patch.set_facecolor('#18192A')
        ax.set_facecolor('#18192A')
        
        # Save the plot to a bytes buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#18192A')
        buf.seek(0)
        plt.close()
        
        # Convert the image to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        # Return the base64-encoded image
        return jsonify({
            'imageData': f'data:image/png;base64,{image_base64}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/questionnaire', methods=['GET', 'POST'])
def initialize_questionnaire():
    """Initialize the questionnaire with education levels and subjects (GET) or process results (POST)"""
    try:
        # US Education System levels
        education_levels = [
            {
                "id": "middle_school",
                "name": "Middle School",
                "description": "Grades 6-8",
                "ages": "11-14 years"
            },
            {
                "id": "high_school",
                "name": "High School", 
                "description": "Grades 9-12",
                "ages": "14-18 years"
            },
            {
                "id": "college_early",
                "name": "College (Early)",
                "description": "Freshman & Sophomore years",
                "ages": "18-20 years"
            },
            {
                "id": "college_late",
                "name": "College (Advanced)",
                "description": "Junior & Senior years",
                "ages": "20-22 years"
            },
            {
                "id": "graduate",
                "name": "Graduate School",
                "description": "Master's & PhD programs",
                "ages": "22+ years"
            }
        ]
        
        # US Subject areas (flattened without category headers)
        subjects = [
            {"id": "math", "name": "Mathematics 🧮", "topics": ["Algebra", "Geometry", "Calculus", "Statistics"]},
            {"id": "physics", "name": "Physics ⚛️", "topics": ["Mechanics", "Electricity", "Waves", "Thermodynamics"]},
            {"id": "chemistry", "name": "Chemistry 🧪", "topics": ["Organic", "Inorganic", "Physical Chemistry"]},
            {"id": "biology", "name": "Biology 🧬", "topics": ["Genetics", "Ecology", "Anatomy", "Cell Biology"]},
            {"id": "computer_science", "name": "Computer Science 💻", "topics": ["Programming", "Algorithms", "Data Structures"]},
            {"id": "history", "name": "History ⏳", "topics": ["World History", "US History", "Ancient Civilizations"]},
            {"id": "geography", "name": "Geography 🌍", "topics": ["Physical Geography", "Human Geography", "Geopolitics"]},
            {"id": "economics", "name": "Economics 💹", "topics": ["Microeconomics", "Macroeconomics", "Personal Finance"]},
            {"id": "psychology", "name": "Psychology 🧠", "topics": ["Cognitive", "Social", "Developmental"]},
            {"id": "literature", "name": "Literature 📚", "topics": ["American Literature", "World Literature", "Poetry"]},
            {"id": "english", "name": "English 🇺🇸", "topics": ["Grammar", "Writing", "Literature"]},
            {"id": "spanish", "name": "Spanish 🇪🇸", "topics": ["Conversation", "Grammar", "Culture"]},
            {"id": "french", "name": "French 🇫🇷", "topics": ["Conversation", "Grammar", "Culture"]},
            {"id": "other_languages", "name": "Other Languages 🌐", "topics": ["German", "Mandarin", "Japanese"]}
        ]
        
        if request.method == 'GET':
            # Return initialization data
            return jsonify({
                'success': True,
                'education_levels': education_levels,
                'subjects': subjects,
                'message': 'Questionnaire initialized successfully'
            })
        
        elif request.method == 'POST':
            # Process submitted questionnaire data
            data = request.json
            
            # Extract user selections
            name = data.get('name', '')
            education_level = data.get('educationLevel', {})
            selected_subjects = data.get('selectedSubjects', [])
            selected_topics = data.get('selectedTopics', [])
            
            # Simulate agent initialization (ignore API call for now as requested)
            # Here we would normally initialize the agent with the user's preferences
            # For now, we'll just store the preferences and return them
            
            # Format the response with selected subjects and topics
            agent_config = {
                'user_profile': {
                    'name': name,
                    'education_level': education_level,
                    'selected_subjects': selected_subjects,
                    'selected_topics': selected_topics
                },
                'agent_status': 'initialized',
                'available_subjects': subjects,
                'timestamp': datetime.now().isoformat()
            }
            
            print(f"Agent initialized for user: {name}")
            print(f"Selected subjects: {[s.get('name', '') for s in selected_subjects]}")
            print(f"Selected topics: {selected_topics}")
            
            return jsonify({
                'success': True,
                'message': 'Agent initialized successfully',
                'agent_config': agent_config,
                'selected_subjects_with_topics': selected_subjects,
                'ready_for_learning': True
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


