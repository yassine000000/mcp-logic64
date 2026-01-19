import os
from typing import List, Dict

# Helpers
def _load_md_files(subdir: str) -> List[Dict[str, str]]:
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "knowledge", subdir))
    items = []
    if not os.path.exists(base_dir):
        return items
    
    for filename in os.listdir(base_dir):
        if filename.endswith(".md"):
            with open(os.path.join(base_dir, filename), "r", encoding="utf-8") as f:
                items.append({
                    "file": filename,
                    "content": f.read()
                })
    return items

def load_decision_model():
    return _load_md_files("decision-model")

def load_decision_matrix():
    return _load_md_files("decision-matrix")

def load_prohibitions():
    return _load_md_files("prohibitions")
