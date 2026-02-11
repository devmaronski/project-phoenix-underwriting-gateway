# ============ BUILD STAGE ============
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN echo "VITE_API_URL=$VITE_API_URL" && test -n "$VITE_API_URL"
RUN VITE_API_URL="$VITE_API_URL" npm run build

# ============ PRODUCTION STAGE ============
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
