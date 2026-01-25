package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.dto.response.ExpenseResponse;
import com.moong.dto.response.MemberExpensePeriodResponse;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MemberExpenseServiceTest extends BaseServiceTest {

    @Autowired
    private MemberExpenseService memberExpenseService;

    @DisplayName("기간 조회: 최신 소비일 우선, 동일 소비일이면 수정일 최신순으로 정렬된다")
    @Test
    void getMemberExpensesByPeriod_sortedBySpentAtDescAndModifiedAtDesc() {
        Member member = memberGenerator.generateSaved("멤버1");

        MemberExpense e1 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 1),
                LocalDateTime.of(2026, 1, 1, 10, 0)
        );
        MemberExpense e2 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 1),
                LocalDateTime.of(2026, 1, 1, 12, 0)
        );
        MemberExpense e3 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 2),
                LocalDateTime.of(2026, 1, 1, 9, 0)
        );

        memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 3),
                LocalDateTime.of(2026, 1, 3, 9, 0)
        );

        int expectedTotal = Stream.of(e1, e2, e3)
                .mapToInt(MemberExpense::getCost)
                .sum();

        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);

        MemberExpensePeriodResponse response = memberExpenseService.getMemberExpensesByPeriod(
                member.getId(),
                startDate,
                endDate
        );

        assertAll(
                () -> assertThat(response.expenses()).hasSize(3),
                () -> assertThat(response.total()).isEqualTo(expectedTotal),
                () -> assertThat(response.expenses())
                        .extracting(ExpenseResponse::expenseId)
                        .containsExactly(e3.getId(), e2.getId(), e1.getId())
        );
    }


    @DisplayName("시작 시간이 끝 시간보다 큰 경우 예외를 던진다")
    @Test
    void getMemberExpenses_invalidDateRange() {
        LocalDate startDate = LocalDate.of(2026, 1, 3);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        long memberId = 1L;

        assertThatThrownBy(() -> memberExpenseService.getMemberExpensesByPeriod(memberId, startDate, endDate))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_DATE_RANGE.getMessage());
    }

}
