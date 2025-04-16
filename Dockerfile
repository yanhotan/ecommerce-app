# ----------------------------------
# BACKEND: Spring Boot with Maven
# ----------------------------------
    FROM maven:3.9.4-eclipse-temurin-17 AS backend-build
    WORKDIR /app/backend
    COPY backend /app/backend
    RUN mvn clean package -DskipTests
    
    # ----------------------------------
    # FRONTEND: React with Node.js
    # ----------------------------------
    FROM node:18 AS frontend-build
    WORKDIR /app/frontend
    COPY frontend /app/frontend
    RUN npm install
    RUN npm run build
    
    # ----------------------------------
    # FINAL IMAGE
    # Combines backend JAR + frontend build
    # ----------------------------------
    FROM eclipse-temurin:17-jdk
    WORKDIR /app
    
    # Copy built backend JAR
    COPY --from=backend-build /app/backend/target/*.jar app.jar
    
    # Copy frontend build into static folder (if served via Spring)
    COPY --from=frontend-build /app/frontend/build /app/public
    
    # ENV for MongoDB (override via docker-compose or .env)
    ENV SPRING_DATA_MONGODB_URI=""
    ENV SPRING_DATA_MONGODB_DATABASE="ecommerce"
    ENV SERVER_PORT=8080
    
    EXPOSE 8080
    CMD ["java", "-jar", "app.jar"]
    