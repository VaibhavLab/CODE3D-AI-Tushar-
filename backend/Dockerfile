# Multi-stage Dockerfile for CODE3D AI Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy maven wrapper and project definition
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/code3d-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
