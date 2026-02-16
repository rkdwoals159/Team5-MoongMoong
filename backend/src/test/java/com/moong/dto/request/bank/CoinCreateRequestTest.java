package com.moong.dto.request.bank;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.dto.BaseVailidationTest;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CoinCreateRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<CoinCreateRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(CoinCreateRequest.class)
                .set("amount", 3000);
    }

    @DisplayName("저금 금액은 음수일 수 없다")
    @Test
    void validateAmount() {
        CoinCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("amount", -1)
                .sample();

        ConstraintViolation<CoinCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("저금 금액은 음수일 수 없습니다");
    }

}
