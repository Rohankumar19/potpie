import os
from pydantic_ai import Agent, RunContext
from dotenv import load_dotenv
from models import LearningPlan

load_dotenv()

# Configure the agent
# You can change the model to 'openai:gpt-4o' or an OpenRouter model if configured
agent = Agent(
    'google-gla:gemini-1.5-flash',
    result_type=LearningPlan,
    system_prompt=(
        "You are an expert curriculum developer named Skill Forge. "
        "Your goal is to create detailed, step-by-step learning paths for users "
        "based on their learning goals. Structure the output strictly using the "
        "LearningPlan model. Be encouraging but technical and precise."
    ),
)

async def generate_learning_path(user_goal: str) -> LearningPlan:
    result = await agent.run(f"Create a learning path for: {user_goal}")
    return result.data
