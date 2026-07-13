# syntax=docker/dockerfile:1.7

FROM maven:3-eclipse-temurin-26 AS build
WORKDIR /workspace

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -ntp dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -ntp -DskipTests package && \
    jar_file="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*.jar.original' | head -n 1)" && \
    test -n "$jar_file" && \
    cp "$jar_file" target/app.jar

FROM eclipse-temurin:17-jre-alpine AS runtime

RUN apk upgrade --no-cache && \
    addgroup -S taskflow && \
    adduser -S -G taskflow taskflow

WORKDIR /app
COPY --from=build --chown=taskflow:taskflow /workspace/target/app.jar /app/app.jar

USER taskflow:taskflow
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
