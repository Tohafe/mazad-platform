# Build stage
FROM maven:3.9.12-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM maven:3.9.12-eclipse-temurin-21 AS runner
WORKDIR /app

COPY --from=builder /app/target/*.jar spring-app.jar

ENTRYPOINT ["java", "-jar", "spring-app.jar"]