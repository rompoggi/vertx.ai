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
from .tools.agent import run_agent
import random

api = Blueprint('api', __name__)

text_blocks = dict()
@api.route('/body', methods=['POST'])
def body_function():
    data = request.json
    text_blocks[data['id']] = {"content": data['text'], "balise": data['balise']}
    # Randomly choose to return a text or an image
    if data["text"] == "Physics":
        return random_text_response()
    
    if data["text"] == "Graph":
        return random_image_response()

    if random.choice([True, False]):
        return random_image_response()
    else:
        return random_text_response()

def random_text_response():
    texts = [
        {"balise": "cours", "text": "Un électron est une particule élémentaire de charge négative."},
        {"balise": "cours", "text": "La dérivée d'une fonction mesure la variation instantanée."},
        {"balise": "cours", "text": "La photosynthèse est le processus par lequel les plantes produisent de l'énergie."}
    ]
    return jsonify(random.choice(texts))

def random_image_response():
    # Choose one of three plot types
    plot_type = random.choice(['parabola', 'sine', 'exp'])
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(6, 4))
    x = np.linspace(0, 10, 1000)
    if plot_type == 'parabola':
        y = x ** 2
        ax.plot(x, y, color='#FFD246', linewidth=2)
        ax.set_title('y = x²')
    elif plot_type == 'sine':
        y = np.sin(x)
        ax.plot(x, y, color='#FFD246', linewidth=2)
        ax.set_title('y = sin(x)')
    else:  # 'exp'
        y = np.exp(x / 3)
        ax.plot(x, y, color='#FFD246', linewidth=2)
        ax.set_title('y = exp(x/3)')
    ax.set_facecolor('#18192A')
    fig.patch.set_facecolor('#18192A')
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#18192A')
    buf.seek(0)
    plt.close()
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return jsonify({
        'balise': "media_image",
        "text": f'data:image/png;base64,{image_base64}',
    })

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
        
        match = re.search(r'f\(x\)\s*=\s*(.+)', function_str)
        if not match:
            return jsonify({'error': 'Invalid function format. Use f(x) = ...'}), 400
        
        return _plot(match, x_min, x_max)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        # Validate x range
    #     if x_min >= x_max:
    #         return jsonify({'error': 'x_min must be less than x_max'}), 400
        
    #     # Extract the right-hand side of the equation
    #     match = re.search(r'f\(x\)\s*=\s*(.+)', function_str)
    #     if not match:
    #         return jsonify({'error': 'Invalid function format. Use f(x) = ...'}), 400
        
    #     expr = match.group(1).strip()
        
    #     # Create x values
    #     x = np.linspace(x_min, x_max, 1000)
        
    #     # Create a new figure with a dark background
    #     plt.style.use('dark_background')
    #     fig, ax = plt.subplots(figsize=(10, 6))
        
    #     # Replace common math operations with numpy equivalents
    #     expr = expr.replace('^', '**')
        
    #     # Create evaluation context with mathematical functions and constants
    #     eval_context = {
    #         'np': np,
    #         'x': x,
    #         'sin': np.sin,
    #         'cos': np.cos,
    #         'tan': np.tan,
    #         'exp': np.exp,
    #         'log': np.log10,  # Base 10 logarithm
    #         'ln': np.log,     # Natural logarithm (base e)
    #         'sqrt': np.sqrt,
    #         'pi': np.pi,
    #         'e': np.e,
    #         'abs': np.abs,
    #         'arcsin': np.arcsin,
    #         'arccos': np.arccos,
    #         'arctan': np.arctan,
    #         'sinh': np.sinh,
    #         'cosh': np.cosh,
    #         'tanh': np.tanh,
    #     }
        
    #     # Evaluate the function
    #     try:
    #         y = eval(expr, eval_context)
    #     except Exception as e:
    #         return jsonify({'error': f'Error evaluating function: {str(e)}'}), 400
        
    #     # Plot the function
        
    #     # Add x=0 and y=0 lines
    #     ax.axhline(y=0, color='skyblue', linestyle='-', linewidth=1, alpha=0.8)
    #     ax.axvline(x=0, color='skyblue', linestyle='-', linewidth=1, alpha=0.8)
        
    #     # Customize the plot
    #     ax.grid(True, alpha=0.2, linestyle='--')
    #     ax.set_title('Function Plot', color='white')
    #     ax.set_xlabel('x', color='white')
    #     ax.set_ylabel('f(x)', color='white')
        
    #     # Set the background color
    #     fig.patch.set_facecolor('#18192A')
    #     ax.set_facecolor('#18192A')
        
    #     # Save the plot to a bytes buffer
    #     buf = io.BytesIO()
    #     plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#18192A')
    #     buf.seek(0)
    #     plt.close()
        
    #     # Convert the image to base64
    #     image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
    #     # Return the base64-encoded image
    #     # return jsonify({
    #     #     'imageData': f'data:image/png;base64,{image_base64}'
    #     # })
    #     return jsonify({
    #         'balise': 'media_image',
    #         'text': f'data:image/png;base64,{image_base64}',
    #     })
        
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500
    
def _plot(function_str, x_min, x_max):
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
    # return jsonify({
    #     'imageData': f'data:image/png;base64,{image_base64}'
    # })
    return jsonify({
        'balise': 'media_image',
        'text': f'data:image/png;base64,{image_base64}',
    })

@api.route('/init', methods=['POST'])
def initialize_agent():
    """Initialize the agent with questionnaire data"""
    try:
        data = request.json
        print("Received questionnaire data:", data)
        
        # Extract user information from the frontend
        name = data.get('name', '')
        education_level = data.get('educationLevel', {})
        selected_subjects = data.get('selectedSubjects', [])
        selected_topics = data.get('selectedTopics', [])
        timestamp = data.get('timestamp', '')
        
        # Format the fixed questions for the agent
        fixed_questions = []
        
        # Add education level information
        if education_level:
            education_info = {
                "question": "What is your education level?",
                "answer": f"{education_level.get('item', '')} (index: {education_level.get('index', '')})",
                "type": "education_level"
            }
            fixed_questions.append(education_info)
        
        # Add selected subjects information
        if selected_subjects:
            subjects_info = {
                "question": "What subjects are you interested in?",
                "answer": ", ".join([f"{subject.get('name', '')} (topics: {', '.join(subject.get('topics', []))})" for subject in selected_subjects]),
                "type": "subjects"
            }
            fixed_questions.append(subjects_info)
        
        # Add selected topics information
        if selected_topics:
            topics_info = {
                "question": "What specific topics would you like to focus on?",
                "answer": ", ".join(selected_topics),
                "type": "topics"
            }
            fixed_questions.append(topics_info)
        
        # Add user name if provided
        if name:
            name_info = {
                "question": "What is your name?",
                "answer": name,
                "type": "name"
            }
            fixed_questions.append(name_info)
        
        print("Fixed questions for agent:", fixed_questions)
        
        # Initialize the agent with the fixed questions
        from tools.agent import init_agent
        init_agent(fixed_questions)
        
        # Create a comprehensive response
        response_data = {
            'success': True,
            'message': 'Agent initialized successfully with questionnaire data',
            'user_profile': {
                'name': name,
                'education_level': education_level,
                'selected_subjects': selected_subjects,
                'selected_topics': selected_topics,
                'timestamp': timestamp
            },
            'agent_status': 'initialized',
            'fixed_questions_count': len(fixed_questions),
            'ready_for_interaction': True
        }
        
        print("Agent initialization successful")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error initializing agent: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to initialize agent: {str(e)}',
            'agent_status': 'error'
        }), 500
