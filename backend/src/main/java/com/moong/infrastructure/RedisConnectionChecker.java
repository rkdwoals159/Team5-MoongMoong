package com.moong.infrastructure;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Slf4j
@Profile("!test")
@Component
@RequiredArgsConstructor
public class RedisConnectionChecker {

    private final RedisConnectionFactory redisConnectionFactory;

    @PostConstruct
    public void init() {
        try (RedisConnection conn = redisConnectionFactory.getConnection()) {
            // Redis 서버의 정보를 담고 있는 INFO 데이터 가져오기
            Properties info = conn.info();

            String version = info.getProperty("redis_version");
            String os = info.getProperty("os");
            String mode = info.getProperty("redis_mode"); // standalone, cluster 등
            String port = info.getProperty("tcp_port");
            String connectedClients = info.getProperty("connected_clients");

            log.info("=================================================");
            log.info("🍃 [REDIS CONNECTION INFO]");
            log.info("✅ Mode    : {}", mode);
            log.info("✅ Version : {}", version);
            log.info("✅ OS      : {}", os);
            log.info("✅ Port    : {}", port);
            log.info("✅ Clients : {} (Current Connected)", connectedClients);
            log.info("✅ Status  : UP");
            log.info("=================================================");

        } catch (Exception e) {
            log.error("=================================================");
            log.error("❌ REDIS CONNECTION ERROR!");
            log.error("Check your host, port or password settings.");
            log.error("Details: {}", e.getMessage());
            log.error("=================================================");
        }
    }
}
