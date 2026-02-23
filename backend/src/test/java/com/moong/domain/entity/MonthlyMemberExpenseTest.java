package com.moong.domain.entity;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.member.Member;
import com.moong.domain.report.MonthlyMemberExpense;
import java.time.Month;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class MonthlyMemberExpenseTest {

    @DisplayName("회원의 월간 소비내역 평균 비용을 볼 수 있다")
    @Test
    void getMonthlyMemberExpense() {
        long amount = 10000L;
        MonthlyMemberExpense monthlyMemberExpense = new MonthlyMemberExpense(
                null,
                2025,
                3,
                amount,
                Mockito.mock(Member.class)
        );

        assertThat(monthlyMemberExpense.getDailyAverageAmount())
                .isEqualTo(amount / Month.of(3).maxLength());
    }
}
