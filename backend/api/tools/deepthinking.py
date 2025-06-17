# /usr/bin/python3
from smolagents.tools import Tool


class DeepThinkingTool(Tool):
    name = "deep_thinking"
    description = "Suggests a reflection path and examples for humanities questions. Uses Claude Opus 4 for deep reasoning."
    inputs = {
        "question": {
            "type": "string",
            "description": "The humanities question or topic",
            "nullable": True,
        },
        "output_path": {
            "type": "string",
            "description": "Path to save the output (optional)",
            "nullable": True,
        },
    }
    output_type = "string"

    def forward(self, question=None, output_path=None):
        from smolagents import LiteLLMModel

        # Use Claude Opus 4
        model = LiteLLMModel(
            model_id="claude-3-opus-20240229",
            temperature=0.3,
            max_tokens=1000,
            api_key="YOUR_CLAUDE_OPUS_API_KEY",
        )
        prompt = f"You are a deep thinking assistant. Suggest a reflection path and give examples for the following question: {question}"
        result = model.generate([{"role": "user", "content": prompt}])
        if output_path:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result)
        return result
