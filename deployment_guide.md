# logic64 VPS Deployment Guide

## Prerequisites
*   Ubuntu VPS (22.04 LTS recommended)
*   Docker & Docker Compose installed
*   Git (optional, or use SCP)

## 1. Prepare the Server
Ensure Docker is running:
```bash
sudo apt update
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl enable --now docker
```

## 2. Transfer Files
Upload the project to your VPS (e.g., `/opt/logic64`).
You need:
*   `src/`
*   `MCP-Core/`
*   `MCP-Decision-System/`
*   `package.json`
*   `tsconfig.json`
*   `Dockerfile`
*   `docker-compose.yml`

## 3. Deploy
Navigate to the directory and run:

```bash
# Build and Start in Background
docker compose up -d --build

# View Logs
docker compose logs -f
```

## 4. Verify Governance
Check the logs. You should see:
> `SUCCESS: Governance Context Maps loaded. logic64 is GOVERNED.`

If you see a CRITICAL error, it means the `MCP-Core` documentation is missing or unreadable.

## 5. Connecting AI Assistant
If running locally on the VPS, the AI Assistant can connect via:
*   **Stdio**: `docker exec -i logic64-core node dist/index.js` (Wrapper needed)
*   **SSE/HTTP**: `http://localhost:3000/sse` (If SSE is enabled)

> [!NOTE]
> Currently, the server starts an HTTP listener on Port 3000.
