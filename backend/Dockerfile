# ============================================================
# STAGE 1: BUILDER
# Purpose: Compile TypeScript, install all dependencies
# This stage is DISCARDED after build (not in final image)
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (dev + prod required for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ============================================================
# STAGE 2: RUNTIME
# Purpose: Run the application in production
# Only includes what's needed to execute
# ============================================================
FROM node:22-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# Excludes devDependencies (Jest, ESLint, ts-node, TypeScript compiler)
RUN npm ci --omit=dev

# Copy built JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# SECURITY: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
