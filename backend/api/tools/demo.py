# /usr/bin/python3
from flask import jsonify
import re
import random

from .plot_functions import plot_function

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


def demo(data):
    if re.search(r"f\(x\)\s*=\s*(.+)", data["text"]):
        return plot_function(data["text"], -3, 3)

    if data["text"] == "Physics":
        return jsonify(PREDEFINED_REPONSE[0])

    if data["text"] == "Maths":
        return jsonify(PREDEFINED_REPONSE[1])

    if data["text"] == "Maths":
        return jsonify(PREDEFINED_REPONSE[2])

    if data["text"] == "Graph":
        return random_image_response()

    return random_text_response()


def random_text_response():
    return jsonify(random.choice(PREDEFINED_REPONSE))


def random_image_response():
    # Choose one of three plot types
    function_str = random.choice(["f(x)=x^2-5", "f(x)=sin(x/2)", "f(x)=exp(x+1)"])
    return plot_function(function_str, x_min=-3, x_max=3)
