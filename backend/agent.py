import logfire
from duckduckgo_search import DDGS
from pydantic_ai import Agent, RunContext
from dotenv import load_dotenv
from models import LearningPlan

load_dotenv()

# Configure Logfire for observability
logfire.configure()

# Configure the agent
# You can change the model to 'openai:gpt-4o' or an OpenRouter model if configured
agent = Agent(
    'google-gla:gemini-1.5-flash',
    result_type=LearningPlan,
    system_prompt=(
        "You are an expert curriculum developer named Skill Forge AI. "
        "Your mission is to architect comprehensive, professional learning paths. "
        "For each module, you MUST provide a practical 'project_idea' that helps the "
        "user apply their knowledge. You should also identify necessary 'prerequisites' "
        "to ensure the user is prepared. Structure the output strictly using the "
        "LearningPlan model. Always use the search_resources tool to find at least "
        "one high-quality external resource (documentation or article) for each module."
    ),
)

@agent.tool
async def search_resources(ctx: RunContext[None], query: str) -> str:
    """
    Search for learning resources, articles, or documentation on the web.
    Use this to find real-world links for the modules.
    """
    with DDGS() as ddgs:
        results = [r for r in ddgs.text(query, max_results=3)]
        if not results:
            return "No results found."
        formatted = "\n".join([f"- {r['title']}: {r['href']}" for r in results])
        return f"Search results for '{query}':\n{formatted}"

async def generate_learning_path(user_goal: str) -> LearningPlan:
    result = await agent.run(f"Create a learning path for: {user_goal}")
    return result.data
