from pydantic import BaseModel, Field
from typing import List

class Resource(BaseModel):
    title: str
    url: str = Field(description="A search query or URL for this resource")
    type: str = Field(description="Video, Article, or Documentation")

class Module(BaseModel):
    title: str
    description: str
    estimated_hours: int
    key_topics: List[str]
    resources: List[Resource]

class LearningPlan(BaseModel):
    goal: str
    difficulty_level: str
    modules: List[Module]
    summary_motivation: str
