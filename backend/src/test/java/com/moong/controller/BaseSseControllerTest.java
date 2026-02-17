package com.moong.controller;

import com.moong.DataBaseCleaner;
import com.moong.fixture.CrewGenerator;
import com.moong.fixture.JwtTokenGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetGenerator;
import com.moong.fixture.PetGroupGenerator;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@ExtendWith(DataBaseCleaner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseSseControllerTest {

    protected static final String BEARER_PREFIX = "Bearer ";

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected JwtTokenGenerator jwtTokenGenerator;

    @Autowired
    protected PetGenerator petGenerator;

    @Autowired
    protected PetGroupGenerator petGroupGenerator;

    @Autowired
    protected CrewGenerator crewGenerator;
}
