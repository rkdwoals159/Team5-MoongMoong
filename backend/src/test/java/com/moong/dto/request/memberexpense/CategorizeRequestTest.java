package com.moong.dto.request.memberexpense;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseValidateTest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;

class CategorizeRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<CategorizeRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(CategorizeRequest.class)
                .set("usage", "example_usage")
                .set("requestId", UUID.randomUUID().toString());
    }

    @DisplayName("사용처는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateUsage(String invalidUsage) {
        CategorizeRequest invalidateRequest = giveDefaultBuilder()
                .set("usage", invalidUsage)
                .sample();

        ConstraintViolation<CategorizeRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("자동 카테고리 분류 - 지출내역은 빈 값일 수 없습니다");
    }

    @DisplayName("요청 id 값은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateRequestId(String invalidRequestId) {
        CategorizeRequest invalidateRequest = giveDefaultBuilder()
                .set("requestId", invalidRequestId)
                .sample();

        ConstraintViolation<CategorizeRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("자동 카테고리 분류 - 요청 id 값은 빈 값일 수 없습니다");
    }
}
