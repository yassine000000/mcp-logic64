from fastapi import FastAPI
from app.loaders.decisions import load_decision_model, load_decision_matrix, load_prohibitions
import json
import os

app = FastAPI(title="Logic64 MCP Decision System", version="1.0.0")

def get_manifest():
    manifest_path = os.path.join(os.path.dirname(__file__), "..", "manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/manifest")
def manifest():
    return get_manifest()

@app.get("/decision-model")
def decision_model():
    """Returns lifecycle, exposure levels, and thresholds."""
    return load_decision_model()

@app.get("/decision-matrix")
def decision_matrix():
    """Returns domain-specific decision matrices (Training, Nutrition, etc.)."""
    return load_decision_matrix()

@app.get("/prohibitions")
def prohibitions():
    """Returns forbidden decisions and AI boundaries."""
    return load_prohibitions()

@app.get("/")
def health_check():
    return {"status": "running", "service": "logic64-mcp-decision", "type": "policy-engine"}
