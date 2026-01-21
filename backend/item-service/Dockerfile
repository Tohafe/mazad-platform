# Build stage
FROM maven:3.9-amazoncorretto-17-debian AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM amazoncorretto:17-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar spring-app.jar

ENTRYPOINT ["java", "-jar", "spring-app.jar"]