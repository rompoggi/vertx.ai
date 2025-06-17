#/usr/bin/python3
from flask import jsonify
import re
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Must be set before importing pyplot
import matplotlib.pyplot as plt
import io
import base64

def plot_function(function_str, x_min, x_max):
    """
    Plot a mathematical function given as a string.
    Assumes the expr is a valid mathematical expression in terms of x.
    """
    # Validate function string
    if not function_str or not isinstance(function_str, str):
        return jsonify({'error': 'Invalid function format. Use f(x) = ...'}), 400
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
        'balise': 'media_image',
        'text': f'data:image/png;base64,{image_base64}',
    })