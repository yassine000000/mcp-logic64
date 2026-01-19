# Base Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (incorporating cache)
COPY package*.json ./
RUN npm ci

# Copy Source Code
COPY tsconfig.json ./
COPY src ./src
COPY MCP-Core ./MCP-Core
COPY MCP-Decision-System ./MCP-Decision-System

# Build TypeScript
RUN npm run build

# Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts and modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Governance Documentation (Required for Index Law Check)
# The server checks these paths at runtime to enforce governance.
COPY --from=builder /app/MCP-Core ./MCP-Core
COPY --from=builder /app/MCP-Decision-System ./MCP-Decision-System

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV GOVERNANCE_MODE=strict

EXPOSE 3000

CMD ["npm", "start"]
