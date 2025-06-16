from smolagents import CodeAgent, LiteLLMModel
from chem import MoleculeImageTool 
from deepthinking import DeepThinkingTool
import uuid

model_id = "claude-3-haiku-20240307"

agent = CodeAgent(
    tools=[MoleculeImageTool(), DeepThinkingTool()],
    model=LiteLLMModel(
        model_id="claude-3-7-sonnet-latest",
        temperature=0.3,
        max_tokens=5000,
    ),
    additional_authorized_imports=["matplotlib.pyplot", "numpy"],
    description="""As an Educational Agent, provide ONE optimal response to {input}:

1. For CHEMISTRY/MATH (if formulas/equations):
   Generate image with embedded caption using:
   <image>[base64]|Caption: [Reflective question]</image>
   Example: "<image>iVBOR...|Caption: How does this molecular shape affect reactivity?</image>"

2. For HUMANITIES/LOGIC:
   <text>[Single thought-provoking question]</text>
   Example: "<text>What would be the strongest counter-argument to this claim?</text>"

Rules:
- Only return 1 tag per response
- Images must contain integrated text
- Maximum 15-word captions
- For visuals: Always highlight 1 key learning point
- No useless informations or formatting : only text or image that is relevant to the student"""
)

input ="""Test Prompt for French History Assistance
Scenario: A high school student is preparing for an exam on 19th-century French political movements but keeps confusing the July Revolution (1830) and the February Revolution (1848). They’ve mixed up key causes and outcomes.

Student’s Query:
"I can’t remember why the 1830 and 1848 revolutions happened or how they’re different. Everything feels the same. Help?"

Agent Instructions:

Diagnose the Issue:

Is this a memorization problem, conceptual confusion, or lack of context?

Gently probe if needed (e.g., "What do you already know about Louis-Philippe’s rule?").

Provide Tiered Support."""

# Specify the output directory for plots
unique_id = str(uuid.uuid4())

agent.run(
    f"{input}",
)