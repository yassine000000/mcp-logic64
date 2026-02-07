#!/bin/bash

# Logic64 VPS Setup Script (v2.0)
# Run this on your VPS as root: ./setup_vps.sh

set -e

echo ">>> [1/4] Updating System..."
apt-get update && apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg git

echo ">>> [2/4] Installing Docker Engine..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

echo ">>> [3/4] Starting Docker..."
systemctl enable --now docker

echo ">>> [4/4] Verifying Installation..."
docker --version
docker compose version

echo ">>> SUCCESS: Environment is ready."
echo "You can now run: docker compose up --build -d"
