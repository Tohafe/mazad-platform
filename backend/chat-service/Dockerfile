#================================= 
# Build stage
#================================= 
FROM maven:3.9-amazoncorretto-17-debian AS build

WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn dependency:go-offline -B

RUN mvn clean package -DskipTests

#================================= 
# Run stage
#================================= 
FROM amazoncorretto:17-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar /app/chat-service.jar

ENTRYPOINT [ "java", "-jar", "/app/chat-service.jar" ]