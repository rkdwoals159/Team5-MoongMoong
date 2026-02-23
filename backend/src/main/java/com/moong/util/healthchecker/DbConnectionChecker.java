package com.moong.util.healthchecker;

import jakarta.annotation.PostConstruct;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DbConnectionChecker {

    private final DataSource dataSource;

    @PostConstruct
    public void init() {
        try (java.sql.Connection conn = dataSource.getConnection()) {
            java.sql.DatabaseMetaData metaData = conn.getMetaData();

            String url = metaData.getURL();
            String user = metaData.getUserName();
            String vendor = metaData.getDatabaseProductName(); // 벤더 이름 (MySQL, H2 등)
            String version = metaData.getDatabaseProductVersion(); // 상세 버전

            log.info("=================================================");
            log.info("🔥 [DB CONNECTION INFO]");
            log.info("✅ Vendor  : {}", vendor);
            log.info("✅ Version : {}", version);
            log.info("✅ URL     : {}", url);
            log.info("✅ User    : {}", user);
            log.info("=================================================");

        } catch (java.sql.SQLException e) {
            log.error("❌ DB Connect Error: ", e);
        }
    }
}

