from mcp.server.fastmcp import FastMCP
from app.loaders.decisions import load_decision_model, load_decision_matrix, load_prohibitions
import json
import os

mcp = FastMCP("logic64-decision-system")

@mcp.tool()
def get_decision_model() -> dict:
    """Returns the Decision Lifecycle Model, exposure levels, and thresholds."""
    return load_decision_model()

@mcp.tool()
def get_decision_matrix() -> dict:
    """Returns the domain-specific decision matrices and weighing logic."""
    return load_decision_matrix()

@mcp.tool()
def get_prohibitions() -> dict:
    """Returns the strict list of forbidden actions, tools, and patterns."""
    return load_prohibitions()

if __name__ == "__main__":
    mcp.run()
