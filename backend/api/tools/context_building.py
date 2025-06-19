# /usr/bin/python3
from smolagents import LiteLLMModel, ChatMessage

"""
We build the context for the Manager agent from the body of the document.

Three parts:

User state estimator: Estimates what help the user might want, if he doesn't understand something, if he asked a question, etc.

Important points extractor: Extracts important points from the document, such as the main topic, step-by-step key points of the document.

Algorithmic context extractor: Extracts the last words of the document, which are likely to be the most relevant for the user.
"""

# TODO for now we get the whole context and juste "user state estimator"

USER_STATE_ESTIMATOR_SYSTEM_PROMPT = """You are an AI model that analyzes the interaction between a user and an AI tutor. Your task is to determine the global state of the user with respect to the problem they are working on. This includes evaluating their overall understanding, confidence level, and any misconceptions they may have.

The context you receive contains both the problem the user is working on and the full interaction between the user and the assistant. Based on this, you must infer why, how and whether they have a correct understanding or are struggling.

Consider whether the user seems confused, is making progress but still unsure, has clearly understood the concept, has made a mistake without realizing it, or has fully mastered the task. Focus solely on the user’s current state in relation to the problem. Do not summarize the assistant’s actions unless they directly affect the user’s understanding.

Your response should consist of two parts: a short summary stating the user’s global state, and a brief explanation that justifies your assessment based on the provided context. Be concise, objective, and grounded in the interaction.

You should NOT answer the questions asked by the user, you should just analyze the interaction and provide an assessment of the user's state.

Do NOT ask questions to the User. Answer by saying "the user..." instead of "you...". You are talking to another ChatBot, not to the user. This model needs to have information from you. You cannot ask questions at all. If you don't know how to provide analysis, say so and stop generating."""


def build_context(body: list[dict]) -> list[dict]:
    """
    Builds the context for the Manager agent from the body of the document.

    Args:
        body (dict): The body of the document, i.e. :[{role="fixedquestion", content="What would you like to work on today?"}, {role="user", content="I'm working on Markov Chains."}].

    Returns:
        dict: The built context for the Manager agent.
    """
    raise NotImplementedError(
        "This function is not implemented yet. Please implement it in the future."
    )
    return_body = body
    return_body[-1]["content"] = (
        "### ORIGINAL USER PROMPT ###\n"
        + body[-1]["content"]
        + "\n### SENTIMENT ANALYSIS RESULT ###\n"
        + user_state_estimator(body).content
    )
    return return_body


def user_state_estimator(body: list[dict]) -> ChatMessage:
    # Call a Claude LLM
    # load api_key from ./api_key.txt
    # with open("./api_key.txt", "r") as f:
    #     key = f.read().strip()
    key = ...
    model = LiteLLMModel(
        model_id="claude-3-5-haiku-latest", temperature=0.3, max_tokens=300, api_key=key
    )
    add_prompt = body
    add_prompt[-1]["content"] = last_content_prompted(body)
    return model.generate(add_prompt)


def last_content_prompted(body):
    return (
        "### ORIGINAL USER PROMPT ###\n"
        + body[-1]["content"]
        + "\n### SYSTEM PROMPT ###\n"
        + USER_STATE_ESTIMATOR_SYSTEM_PROMPT
    )


if __name__ == "__main__":
    # Example usage
    body = [
        {"role": "assistant", "content": "What would you like to work on today?"},
        {"role": "user", "content": "I'm working on Markov Chains"},
        {"role": "assistant", "content": "Do you need help?"},
        {
            "role": "user",
            "content": "Yes, I get what Markov Chains are, but I don't understand how to calculate the transition matrix from a description...",
        },
    ]
    print(build_context(body))
