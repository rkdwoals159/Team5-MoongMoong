package com.moong.dto.request;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.dto.BaseValidateTest;
import com.moong.dto.request.petgroup.PetGroupParticipateRequest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;

class PetGroupParticipateRequestTest extends BaseValidateTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<PetGroupParticipateRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(PetGroupParticipateRequest.class)
                .set("inviteUrl", "https://moongmoong.site/invite/default");
    }

    @DisplayName("초대코드는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateInviteUrlFail(String unvalidatedInviteUrl) {
        PetGroupParticipateRequest invalidateRequest = giveDefaultBuilder()
                .set("inviteUrl", unvalidatedInviteUrl)
                .sample();

        ConstraintViolation<PetGroupParticipateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("그룹 초대 요청 - 초대코드 URL은 빈 값일 수 없습니다");
    }

    @DisplayName("초대코드 정상 케이스 - 통과")
    @Test
    void validateInviteUrlSuccess() {
        PetGroupParticipateRequest invalidateRequest = giveDefaultBuilder()
                .sample();

        Set<ConstraintViolation<PetGroupParticipateRequest>> violations = validator.validate(invalidateRequest);

        assertThat(violations).isEmpty();
    }
}
