# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application with optimization
RUN npm run build

# Production stage with security and optimization
FROM nginx:alpine AS production

# Install security updates and curl
RUN apk update && apk add --no-cache curl && rm -rf /var/cache/apk/*

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user for security
RUN addgroup -g nginx && adduser -D -s -G nginx -u nginx

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /etc/nginx/conf.d
RUN chmod -R 755 /usr/share/nginx/html

USER nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx with optimized settings
CMD ["nginx", "-g", "daemon off;"]
