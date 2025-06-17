# /usr/bin/python3
# import re


def parse_text(text):
    """
    Parses the input text to extract the conversation in a json format.

    Args:
        text (str): The input text containing mathematical expressions.

    Returns:
        list of tuples: Each tuple contains a role ('user' or role) and the corresponding message.
    """
    S_o = "[$"
    S_c = "$]"
    End = "$END$"

    temp = text.split(End)
    res = []
    for sentence in temp:
        if S_o in sentence and S_c in sentence:
            start = sentence.index(S_o) + len(S_o)
            end = sentence.index(S_c)
            role = sentence[start:end].strip()
            message = sentence[end + len(S_c) :].strip()
        else:
            role = "user"
            message = sentence.strip()
        if len(message) > 0:
            res.append((role, message))
    return res
