
"""
We build the context for the Manager agent from the body of the document.

Three parts:

User state estimator: Estimates what help the user might want, if he doesn't understand something, if he asked a question, etc.

Important points extractor: Extracts important points from the document, such as the main topic, step-by-step key points of the document.

Algorithmic context extractor: Extracts the last words of the document, which are likely to be the most relevant for the user.
"""

def build_context(body: list[dict]) -> list[dict]:
    """
    Builds the context for the Manager agent from the body of the document.
    
    Args:
        body (dict): The body of the document, i.e. :[{role="fixedquestion", content="What would you like to work on today?"}, {role="user", content="I'm working on Markov Chains."}].
    
    Returns:
        dict: The built context for the Manager agent.
    """
    return {
        "user_state_estimator": body.get("user_state_estimator", {}),
        "important_points_extractor": body.get("important_points_extractor", {}),
        "algorithmic_context_extractor": body.get("algorithmic_context_extractor", {})
    }