from fastapi import FastAPI
from app.manifest import get_manifest
from app.loaders.architecture import load_architecture
from app.loaders.rules import load_rules
from app.loaders.standards import load_standards

app = FastAPI(title="Logic64 MCP Server", version="1.0.0")

@app.get("/manifest")
def manifest():
    """Returns the MCP server capability manifest."""
    return get_manifest()

@app.get("/architecture")
def architecture():
    """Returns architecture knowledge base."""
    return load_architecture()

@app.get("/rules")
def rules():
    """Returns governance rules."""
    return load_rules()

@app.get("/standards")
def standards():
    """Returns coding standards."""
    return load_standards()

@app.get("/")
def health_check():
    """Health check endpoint."""
    return {"status": "running", "service": "logic64-mcp-core", "version": "1.0.0"}
