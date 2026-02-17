package com.moong.dto.request.bank;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseValidateTest;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class BankUpdateRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<BankUpdateRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(BankUpdateRequest.class)
                .set("target", 3000);
    }

    @DisplayName("저금통 목표 금액은 음수일 수 없다")
    @Test
    void validateTarget() {
        BankUpdateRequest invalidateRequest = giveDefaultBuilder()
                .set("target", -1)
                .sample();

        ConstraintViolation<BankUpdateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("저금통 목표 금액 변경 - 저금통 목표 금액은 음수일 수 없습니다");
    }
}
