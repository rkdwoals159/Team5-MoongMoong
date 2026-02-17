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

class BankCreateRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<BankCreateRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(BankCreateRequest.class)
                .set("target", 3000);
    }

    @DisplayName("저금통 목표 금액은 음수일 수 없다")
    @Test
    void validateTarget() {
        BankCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("target", -1)
                .sample();

        ConstraintViolation<BankCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("저금통 생성 요청 -저금통 목표 금액은 음수일 수 없습니다");
    }
}
