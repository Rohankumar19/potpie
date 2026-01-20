import logfire
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import generate_learning_path

app = FastAPI(title="Skill Forge API")

# Instrument FastAPI with Logfire
logfire.instrument_fastapi(app)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestData(BaseModel):
    goal: str

@app.post("/api/generate-plan")
async def generate_plan(data: RequestData):
    try:
        if not data.goal:
            raise HTTPException(status_code=400, detail="Goal is required")
        
        plan = await generate_learning_path(data.goal)
        return plan
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Skill Forge API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
