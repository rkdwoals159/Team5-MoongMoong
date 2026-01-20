FROM eclipse-temurin:17-jdk AS builder

WORKDIR /application

COPY build/libs/backend-*.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:17-jre AS runtime

WORKDIR /application

COPY --from=builder /application/dependencies/ ./
COPY --from=builder /application/spring-boot-loader/ ./
COPY --from=builder /application/snapshot-dependencies/ ./
COPY --from=builder /application/application/ ./

ENTRYPOINT ["sh", "-c", "exec java ${RUN_JAVA_ENV} org.springframework.boot.loader.launch.JarLauncher"]
