package com.moong.domain.entity;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mockito;

class MemberExpenseTest {

    @DisplayName("소비금액은 0원 이상 천만원 미만이어야 한다")
    @ValueSource(longs = {MemberExpense.MIN_PAYMENT_AMOUNT - 1, MemberExpense.MAX_PAYMENT_AMOUNT + 1})
    @ParameterizedTest
    void invalidCost(long invalidCost) {
        assertThatThrownBy(() -> new MemberExpense(
                                1L,
                                LocalDate.now(),
                                "usage",
                                invalidCost,
                                MainCategoryType.MEDICAL_EXPENSES,
                                SubCategoryType.CONSULTATION,
                                "",
                                LocalDateTime.now(),
                                Mockito.mock(Member.class)
                    )
                ).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_EXPENSE_COST_AMOUNT.getMessage());
    }
}
