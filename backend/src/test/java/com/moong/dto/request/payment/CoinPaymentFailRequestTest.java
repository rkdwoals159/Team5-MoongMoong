package com.moong.dto.request.payment;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseVailidationTest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;

class CoinPaymentFailRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<CoinPaymentFailRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(CoinPaymentFailRequest.class)
                .set("code", "ALREADY_PROCESSED_PAYMENT")
                .set("message", "이미 처리된 결제 입니다.")
                .set("orderId", UUID.randomUUID());
    }


    @DisplayName("결제 오류 code는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateCode(String invalidCode) {
        CoinPaymentFailRequest invalidateRequest = giveDefaultBuilder()
                .set("code", invalidCode)
                .sample();

        ConstraintViolation<CoinPaymentFailRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 신청 실패 시 요청 - code는 빈 값일 수 없습니다");
    }

    @DisplayName("결제 오류 메시지는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateMessage(String invalidMessage) {
        CoinPaymentFailRequest invalidateRequest = giveDefaultBuilder()
                .set("message", invalidMessage)
                .sample();

        ConstraintViolation<CoinPaymentFailRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 신청 실패 시 요청 - 토스 에러 메시지는 빈 값일 수 없습니다");
    }

    @DisplayName("결제 id는 null일 수 없다")
    @Test
    void validateOrderId() {
        CoinPaymentFailRequest invalidateRequest = giveDefaultBuilder()
                .set("orderId", null)
                .sample();

        ConstraintViolation<CoinPaymentFailRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 신청 실패 시 요청 - orderId는 빈 값일 수 없습니다");
    }
}
