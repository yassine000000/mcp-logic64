import os
from typing import List
from app.models.mcp_models import KnowledgeItem

# Points to logic64-mcp/knowledge/coding-standards
KNOWLEDGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "knowledge", "coding-standards"))

def load_standards() -> List[KnowledgeItem]:
    items = []
    if not os.path.exists(KNOWLEDGE_DIR):
        os.makedirs(KNOWLEDGE_DIR, exist_ok=True)
        return items
        
    for filename in os.listdir(KNOWLEDGE_DIR):
        if filename.endswith(".md"):
            path = os.path.join(KNOWLEDGE_DIR, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                items.append(KnowledgeItem(
                    file=filename,
                    topic="coding-standards",
                    content=content
                ))
            except Exception as e:
                print(f"Error reading {filename}: {e}")
    return items
