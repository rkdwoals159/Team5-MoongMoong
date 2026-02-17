package com.moong.dto.request.member;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseValidateTest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;

class MemberUpdateNameRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<MemberUpdateNameRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(MemberUpdateNameRequest.class)
                .set("memberName", "회원이름");
    }

    @DisplayName("업데이트를 요청한 이름은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateAccessTokenFail(String invalidName) {
        MemberUpdateNameRequest invalidateRequest = giveDefaultBuilder()
                .set("memberName", invalidName)
                .sample();

        ConstraintViolation<MemberUpdateNameRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("닉네임 업데이트 요청 - 회원 닉네임은 빈 값일 수 없습니다.");
    }
}
