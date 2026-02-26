FROM maven:3.9-amazoncorretto-21 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM amazoncorretto:21-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar Notification-app.jar

ENTRYPOINT ["java", "-jar", "Notification-app.jar"]