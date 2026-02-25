package com.moong.controller;

import static org.mockito.ArgumentMatchers.anyString;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.DataBaseCleaner;
import com.moong.client.oauth.OAuthClient;
import com.moong.domain.member.MemberInfo;
import com.moong.fixture.*;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.specification.RequestSpecification;
import java.security.SecureRandom;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@ActiveProfiles("test")
@ExtendWith(DataBaseCleaner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseControllerTest {

    protected static final String BEARER_PREFIX = "Bearer ";

    @Autowired
    protected PetGenerator petGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected PetGroupGenerator petGroupGenerator;

    @Autowired
    protected CrewGenerator crewGenerator;

    @Autowired
    protected GroupExpenseGenerator groupExpenseGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;

    @Autowired
    protected GroupMedicalAdviceGenerator groupMedicalAdviceGenerator;

    @Autowired
    protected TreatmentGenerator treatmentGenerator;

    @Autowired
    protected PetMedicalGenerator petMedicalGenerator;

    @Autowired
    protected  BankGenerator bankGenerator;
  
    @Autowired
    protected GroupBankGenerator groupBankGenerator;

    @Autowired
    protected CoinGenerator coinGenerator;

    @Autowired
    protected JwtTokenGenerator jwtTokenGenerator;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected NotificationCursorGenerator notificationCursorGenerator;

    @Autowired
    protected NotificationGenerator notificationGenerator;

    @Autowired
    protected CrewNotificationGenerator crewNotificationGenerator;

    @MockitoBean
    protected OAuthClient oAuthClient;

    @MockitoBean
    private RedissonClient redissonClient;

    @LocalServerPort
    private int port;

    private RequestSpecification spec;

    @BeforeEach
    void setEnvironment() {
        RestAssured.config = RestAssuredConfig.config()
                .objectMapperConfig(ObjectMapperConfig.objectMapperConfig()
                        .jackson2ObjectMapperFactory((cls, charset) -> objectMapper));

        RestAssured.port = port;
        spec = new RequestSpecBuilder()
                .addFilter(new RequestLoggingFilter())
                .addFilter(new ResponseLoggingFilter())
                .build();

        int randNum = new SecureRandom().nextInt(1000);
        Mockito.when(oAuthClient.requestMemberInfo(anyString()))
                .thenReturn(new MemberInfo("email" + randNum + "@email.com"));
    }

    protected RequestSpecification given() {
        return RestAssured.given(spec);
    }
}

