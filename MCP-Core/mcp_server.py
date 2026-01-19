from mcp.server.fastmcp import FastMCP
from app.manifest import get_manifest
from app.loaders.architecture import load_architecture
from app.loaders.rules import load_rules
from app.loaders.standards import load_standards

# Initialize the Native MCP Server
mcp = FastMCP("logic64-mcp-core")

@mcp.tool()
def get_governance_manifest() -> dict:
    """Returns the MCP server capability manifest and active constraints."""
    return get_manifest()

@mcp.tool()
def read_architecture() -> list:
    """Returns the full system architecture knowledge base."""
    return load_architecture()

@mcp.tool()
def read_governance_rules() -> list:
    """Returns the active governance rules and laws."""
    return load_rules()

@mcp.tool()
def read_coding_standards() -> list:
    """Returns the enforced coding standards for the project."""
    return load_standards()

if __name__ == "__main__":
    mcp.run()
