package com.moong.flyway;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import com.moong.service.report.MailService;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("flyway")
class DatabaseSchemaManagerTest {

    @Container
    static MySQLContainer<?> mysql =
            new MySQLContainer<>(
                    DockerImageName.parse("mysql:8.0.36")
            )
                    .withDatabaseName("testdb")
                    .withUsername("test")
                    .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "com.mysql.cj.jdbc.Driver");
    }

    @Autowired
    private Flyway flyway;

    @Autowired
    private DataSource dataSource;

    @MockitoBean
    private MailService mailService;

    @MockitoBean
    protected RedissonClient redissonClient;

    @DisplayName("flyway 스크립트를 모두 잘 실행한다")
    @Test
    void contextLoads() {
        assertThatCode(() -> flyway.validate()).doesNotThrowAnyException();
    }

    @DisplayName("모든 테이블을 정상적으로 생성한다")
    @Test
    void allTablesShouldBeCreated() throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            String[] expectedTables = {
                    "member", "pet", "pet_group", "bank", "crew",
                    "coin", "coin_payment", "member_expense", "group_expense",
                    "group_medical_advice", "pet_medical", "treatment", "worried_disease",
                    "monthly_member_expense", "monthly_group_expense",
            };

            for (String table : expectedTables) {
                ResultSet rs = stmt.executeQuery(
                        "SELECT COUNT(*) as cnt FROM information_schema.tables " +
                                "WHERE table_schema = 'testdb' AND table_name = '" + table + "'"
                );
                rs.next();
                int count = rs.getInt("cnt");
                assertThat(count)
                        .as("Table '%s' should exist", table)
                        .isEqualTo(1);
            }
        }
    }
}
