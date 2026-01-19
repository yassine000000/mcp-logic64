#!/bin/bash

# logic64 VPS Setup Script
# Run this on your VPS as root

set -e

echo ">>> Updating System..."
apt-get update && apt-get install -y python3 python3-pip python3-venv git

PROJECT_ROOT="/root/mcp-logic64"

echo ">>> Setting up MCP-Core..."
cd "$PROJECT_ROOT/MCP-Core"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

echo ">>> Setting up MCP-Decision-System..."
cd "$PROJECT_ROOT/MCP-Decision-System"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

echo ">>> Setup Complete!"
echo "You can now run the servers using the start commands."
