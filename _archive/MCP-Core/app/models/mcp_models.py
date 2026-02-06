from pydantic import BaseModel
from typing import List, Dict, Optional

class Manifest(BaseModel):
    name: str
    version: str
    description: str
    type: str
    readOnly: bool
    capabilities: Dict[str, bool]
    access: Dict[str, List[str]]

class KnowledgeItem(BaseModel):
    file: str
    topic: str
    content: str
