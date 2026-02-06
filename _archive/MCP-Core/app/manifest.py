import json
import os
from app.models.mcp_models import Manifest

# Path to the manifest.json file (two directories up from this file)
MANIFEST_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "manifest.json"))

def get_manifest() -> Manifest:
    """Reads and validates the manifest.json file."""
    if not os.path.exists(MANIFEST_PATH):
        raise FileNotFoundError(f"Manifest file not found at {MANIFEST_PATH}")
        
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return Manifest(**data)
