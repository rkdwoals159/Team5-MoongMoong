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

class MemberUpdateProfileRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<MemberUpdateProfileRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(MemberUpdateProfileRequest.class)
                .set("memberImageUrl", "회원이름");
    }

    @DisplayName("업데이트를 요청한 이미지 url은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateAccessTokenFail(String invalidImageUrl) {
        MemberUpdateProfileRequest invalidateRequest = giveDefaultBuilder()
                .set("memberImageUrl", invalidImageUrl)
                .sample();

        ConstraintViolation<MemberUpdateProfileRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("회원 프로필 변경 - 회원 프로필 url은 빈값일 수 없습니다");
    }
}
