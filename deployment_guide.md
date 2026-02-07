# Logic64 VPS Deployment Guide (v2.0)

## Prerequisites
*   Ubuntu VPS (22.04 LTS recommended)
*   Root access

## 1. Setup Environment
We have provided a script to automatically install Docker and dependencies.

1.  **Pull the latest code**:
    ```bash
    git fetch origin && git reset --hard origin/master
    ```

2.  **Run the Setup Script**:
    ```bash
    chmod +x setup_vps.sh
    ./setup_vps.sh
    ```
    *This will install Docker and the Docker Compose plugin.*

## 2. Deploy Logic64
Once the setup is complete, run:

```bash
# Build and Start
docker compose up --build -d

# View Logs
docker compose logs -f
```

> **Note**: Use `docker compose` (with a space), NOT `docker-compose`.

## 3. Verify Deployment
1.  Check if the container is running:
    ```bash
    docker ps
    ```
    You should see `logic64-kernel` on port `3001`.

2.  Test the Endpoint:
    ```bash
    curl http://localhost:3001/sse
    ```

## 4. Updates
To update the server after pushing to GitHub:
```bash
git pull origin master
docker compose up --build -d
```
