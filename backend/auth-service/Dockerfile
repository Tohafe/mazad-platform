# # Build stage
# FROM maven:3.9-amazoncorretto-17-debian AS build
# WORKDIR /app
# COPY pom.xml .
# RUN mvn dependency:go-offline
# COPY src ./src
# RUN mvn clean package -DskipTests

# # Run stage
# FROM amazoncorretto:17-alpine
# WORKDIR /app

# COPY --from=build /app/target/*.jar spring-app.jar

# ENTRYPOINT ["java", "-jar", "spring-app.jar"]

# Build stage
FROM maven:3.9-amazoncorretto-17-debian AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM amazoncorretto:17-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=build /app/target/auth-service-*.jar app.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]