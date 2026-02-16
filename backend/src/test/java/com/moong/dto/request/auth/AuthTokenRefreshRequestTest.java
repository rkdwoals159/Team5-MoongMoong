package com.moong.dto.request.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseVailidationTest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;

class AuthTokenRefreshRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<AuthTokenRefreshRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(AuthTokenRefreshRequest.class)
                .set("accessToken", "access_token")
                .set("refreshToken", "refresh_token");
    }

    @DisplayName("엑세스 토큰은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateAccessTokenFail(String invalidAccessToken) {
        AuthTokenRefreshRequest invalidateRequest = giveDefaultBuilder()
                .set("accessToken", invalidAccessToken)
                .sample();

        ConstraintViolation<AuthTokenRefreshRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("만료된 엑세스 토큰은 빈 값일 수 없습니다");
    }

    @DisplayName("리프레시 토큰은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateRefreshTokenFail(String invalidRefreshToken) {
        AuthTokenRefreshRequest invalidateRequest = giveDefaultBuilder()
                .set("refreshToken", invalidRefreshToken)
                .sample();

        ConstraintViolation<AuthTokenRefreshRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("리프레시 토큰은 빈 값일 수 없습니다");
    }
}
