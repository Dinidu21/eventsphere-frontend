# Multi-stage build for minimal image size

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Install serve (static file server, 5MB footprint)
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Accept PORT from environment (Cloud Run sets this)
ENV PORT=8080
EXPOSE $PORT

# Health check (Cloud Run uses this)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["serve", "-s", "build", "-l", "$PORT"]
