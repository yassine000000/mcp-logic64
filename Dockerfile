# Base Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy Configs
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy Source
COPY . .

# Build Kernel
RUN npm run build

# Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data


# Environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the Kernel
CMD ["node", "dist/index.js"]
