# Build stage with shared dependencies
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

# Build client and server
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy necessary files from build stage
COPY --from=builder /app/dist ./dist

# Copy drizzle configuration and schema for migrations
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/shared ./shared

# Copy configuration files
COPY --from=builder /app/package.json ./

EXPOSE ${PORT:-5000}

CMD ["sh", "-c", "npm run db:push && npm run start"]
