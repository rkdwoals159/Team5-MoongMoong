package com.moong.domain.entity;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.report.MonthlyGroupExpense;
import java.time.Month;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MonthlyGroupExpenseTest {

    @DisplayName("월별 일간 평균 소비 비용을 반환할 수 있다")
    @Test
    void getDailyCost() {
        long amount = 10000L;
        MonthlyGroupExpense monthlyGroupExpense = new MonthlyGroupExpense(
                null,
                2025,
                3,
                amount,
                1L
        );

        assertThat(monthlyGroupExpense.getAverageDailyAmount())
                .isEqualTo(amount / Month.of(3).maxLength());
    }
}
