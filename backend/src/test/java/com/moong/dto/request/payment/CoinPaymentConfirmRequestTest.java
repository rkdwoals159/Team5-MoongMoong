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

class CoinPaymentConfirmRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<CoinPaymentConfirmRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(CoinPaymentConfirmRequest.class)
                .set("orderId", UUID.randomUUID())
                .set("amount", 100L)
                .set("paymentKey", "asdfew20260205134206Rsdd");
    }

    @DisplayName("결제 id는 null일 수 없다")
    @Test
    void validateOrderId() {
        CoinPaymentConfirmRequest invalidateRequest = giveDefaultBuilder()
                .set("orderId", null)
                .sample();

        ConstraintViolation<CoinPaymentConfirmRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 confirm 요청 - 결제 Id는 null일 수 없습니다");
    }

    @DisplayName("결제 금액은 음수 값일 수 없다")
    @Test
    void validateAmount() {
        CoinPaymentConfirmRequest invalidateRequest = giveDefaultBuilder()
                .set("amount", -1L)
                .sample();

        ConstraintViolation<CoinPaymentConfirmRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 confirm 요청 - 결제 요청 금액은 음수일 수 없습니다");
    }

    @DisplayName("결제 금액은 음수 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validatePaymentKey(String invalidPaymentKey) {
        CoinPaymentConfirmRequest invalidateRequest = giveDefaultBuilder()
                .set("paymentKey", invalidPaymentKey)
                .sample();

        ConstraintViolation<CoinPaymentConfirmRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("결제 confirm 요청 - 결제 키는 빈 값일 수 없습니다");
    }
}
