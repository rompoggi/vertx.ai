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

api = Blueprint('api', __name__)

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


