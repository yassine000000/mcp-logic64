# Base Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy Root Configs
COPY package.json package-lock.json* ./

# Copy Kernel Configs
COPY apps/kernel/package.json ./apps/kernel/

# Install dependencies
RUN npm install

# Copy Kernel Source
COPY apps/kernel ./apps/kernel

# Build Kernel
WORKDIR /app/apps/kernel
RUN npm run build

# Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/kernel/package.json ./apps/kernel/
COPY --from=builder /app/apps/kernel/dist ./apps/kernel/dist
COPY --from=builder /app/apps/kernel/data ./apps/kernel/data
COPY --from=builder /app/apps/kernel/node_modules ./apps/kernel/node_modules

# Environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the Kernel
WORKDIR /app/apps/kernel
CMD ["node", "dist/index.js"]
