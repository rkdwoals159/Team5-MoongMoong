package com.moong.repository.monthlyexpense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.report.MonthlyGroupExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BaseRepositoryTest;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MonthlyGroupExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private MonthlyGroupExpenseRepository monthlyGroupExpenseRepository;

    @DisplayName("지정한 기간 내의 월별 그룹 소비내역을 가져올 수 있다")
    @Test
    void findByPetGroupIdBetween() {
        YearMonth yearMonth = YearMonth.now();
        YearMonth nextMonth = yearMonth.plusMonths(1);
        MonthlyGroupExpense expense1 = monthlyGroupExpenseGenerator.generate(yearMonth, 1L, 100L);
        MonthlyGroupExpense expense2 = monthlyGroupExpenseGenerator.generate(nextMonth, 1L, 100L);
        MonthlyGroupExpense expense3 = monthlyGroupExpenseGenerator.generate(yearMonth, 2L, 100L);

        List<MonthlyGroupExpense> actual = monthlyGroupExpenseRepository.findByPetGroupIdBetween(
                1L,
                yearMonth.getYear(),
                yearMonth.getMonthValue(),
                yearMonth.getYear(),
                yearMonth.getMonthValue()
        );

        assertThat(actual)
                .extracting(MonthlyGroupExpense::getId)
                .containsExactly(expense1.getId());
    }

    @DisplayName("지정한 월의 그룹 소비내역을 가져올 수 있다")
    @Test
    void findMonthlyGroupExpenseSuccess() {
        YearMonth yearMonth = YearMonth.now();
        YearMonth lastMonth = yearMonth.minusMonths(1);
        YearMonth twoMonthAgo = yearMonth.minusMonths(2);
        MonthlyGroupExpense expense1 = monthlyGroupExpenseGenerator.generate(yearMonth, 1L, 100L);
        MonthlyGroupExpense expense2 = monthlyGroupExpenseGenerator.generate(lastMonth, 1L, 100L);
        MonthlyGroupExpense expense3 = monthlyGroupExpenseGenerator.generate(twoMonthAgo, 1L, 100L);

        MonthlyGroupExpense actual = monthlyGroupExpenseRepository.getByExpenseYearAndExpenseMonth(yearMonth, 1L);

        assertThat(actual.getId()).isEqualTo(expense1.getId());
    }

    @DisplayName("지정한 월의 그룹 소비내역이 없는 경우 커스텀 에러가 발생한다")
    @Test
    void findMonthlyGroupExpenseFail() {
        assertThatThrownBy(() -> monthlyGroupExpenseRepository.getByExpenseYearAndExpenseMonth(YearMonth.now(), 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.MONTHLY_GROUP_EXPENSE_NOT_FOUND.getMessage());
    }

    @DisplayName("그룹 월별 소비내역을 벌크쿼리로 저장할 수 있다")
    @Test
    void saveByBulkQuery() {
        YearMonth yearMonth = YearMonth.now();
        YearMonth lastMonth = yearMonth.minusMonths(1);
        YearMonth twoMonthAgo = yearMonth.minusMonths(2);
        MonthlyGroupExpense expense1 = new MonthlyGroupExpense(yearMonth, 100L, 1L);
        MonthlyGroupExpense expense2 = new MonthlyGroupExpense(lastMonth, 100L, 1L);
        MonthlyGroupExpense expense3 = new MonthlyGroupExpense(twoMonthAgo, 100L, 1L);

        monthlyGroupExpenseRepository.saveAllByBulkQuery(List.of(expense1, expense2, expense3));

        List<MonthlyGroupExpense> actual = monthlyGroupExpenseRepository.findByPetGroupIdBetween(
                1L,
                twoMonthAgo.getYear(),
                twoMonthAgo.getMonthValue(),
                yearMonth.getYear(),
                yearMonth.getMonthValue()
        );
        assertThat(actual).hasSize(3);
    }
}
