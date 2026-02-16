package com.moong.dto.request.memberexpense;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.dto.BaseVailidationTest;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;

class MemberExpenseUpsertRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<MemberExpenseUpsertRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(MemberExpenseUpsertRequest.class)
                .set("isNew", true)
                .set("expenseId", null)
                .set("spentAt", LocalDate.now())
                .set("usage", "감기약 구매")
                .set("cost", 10_000L)
                .set("mainCategory", MainCategoryType.MEDICAL_EXPENSES)
                .set("subCategory", SubCategoryType.CONSULTATION)
                .set("memo", "정기 구매");
    }

    @DisplayName("사용 시기는 빈 값일 수 없다")
    @NullSource
    @ParameterizedTest
    void validateSpentAt(String invalidSpentAt) {
        MemberExpenseUpsertRequest invalidateRequest = giveDefaultBuilder()
                .set("spentAt", invalidSpentAt)
                .sample();

        ConstraintViolation<MemberExpenseUpsertRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("멤버 소비내역 갱신 - 소비날짜는 null일 수 없습니다");
    }

    @DisplayName("사용처는 빈 값일 수 없다")
    @NullSource
    @ParameterizedTest
    void validateUsage(String invalidUsage) {
        MemberExpenseUpsertRequest invalidateRequest = giveDefaultBuilder()
                .set("usage", invalidUsage)
                .sample();

        ConstraintViolation<MemberExpenseUpsertRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("멤버 소비내역 갱신 - 사용 내역은 null일 수 없습니다");
    }

    @DisplayName("사용처는 빈 값일 수 없다")
    @Test
    void validateMainCategory() {
        MemberExpenseUpsertRequest invalidateRequest = giveDefaultBuilder()
                .set("mainCategory", null)
                .sample();

        ConstraintViolation<MemberExpenseUpsertRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("멤버 소비내역 갱신 - 대분류는 null일 수 없습니다.");
    }

    @DisplayName("사용 금액은 음수일 수 없다")
    @Test
    void validateCost() {
        MemberExpenseUpsertRequest invalidateRequest = giveDefaultBuilder()
                .set("cost", -1)
                .sample();

        ConstraintViolation<MemberExpenseUpsertRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("멤버 소비내역 갱신 - 사용금액은 0이상 혹은 양수여야 합니다");
    }
}
