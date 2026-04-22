# Multi-stage build for production optimization
FROM openjdk:17-jdk-slim AS builder

# Set working directory
WORKDIR /app

# Copy gradlew and gradle files for caching
COPY gradlew .
COPY gradle gradle-wrapper.jar gradle-wrapper.properties .gradle

# Copy source code
COPY src ./src/
COPY build.gradle ./
COPY settings.gradle ./

# Create non-root user for security
RUN addgroup --system appgroup && adduser --system --group appgroup appuser
USER appuser

# Make gradlew executable
RUN chmod +x ./gradlew

# Build application with production profile
RUN ./gradlew build -x test --no-daemon -Pprod

# Production stage
FROM openjdk:17-jre-slim AS production

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system appgroup && adduser --system --group appgroup appuser
USER appuser

# Set working directory
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /app/build/libs/*.jar ./app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set JVM options for production
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseStringDeduplication"

# Run application with optimized JVM settings
CMD ["sh", "-c", "java $JAVA_OPTS -jar ./app.jar"]
