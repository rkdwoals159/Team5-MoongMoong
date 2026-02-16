package com.moong.dto.request.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseVailidationTest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;

class AuthLoginRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<AuthLoginRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(AuthLoginRequest.class)
                .set("inviteUrl", "https://moongmoong.site/invite/default")
                .set("accessToken", "access_token");
    }

    @DisplayName("엑세스 토큰은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateAccessTokenFail(String invalidAccessToken) {
        AuthLoginRequest invalidateRequest = giveDefaultBuilder()
                .set("accessToken", invalidAccessToken)
                .sample();

        ConstraintViolation<AuthLoginRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("엑세스 토큰은 빈 값일 수 없습니다");
    }
}
