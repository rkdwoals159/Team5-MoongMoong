package com.moong.repository.monthlyexpense;

import com.moong.domain.entity.MonthlyGroupExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface MonthlyGroupExpenseRepository
        extends Repository<MonthlyGroupExpense, Long>,  MonthlyGroupExpenseJdbcRepository {

    MonthlyGroupExpense save(MonthlyGroupExpense monthlyGroupExpense);

    @Query("""
    select m
    from MonthlyGroupExpense m
    where m.petGroupId = :petGroupId
      and ((m.expenseYear > :startYear or (m.expenseYear = :startYear and m.expenseMonth >= :startMonth)))
      and ((m.expenseYear < :endYear or (m.expenseYear = :endYear and m.expenseMonth <= :endMonth)))
    order by m.expenseYear, m.expenseMonth
""")
    List<MonthlyGroupExpense> findByPetGroupIdBetween(
            @Param(value = "petGroupId") long petGroupId,
            @Param(value = "startYear") int startYear,
            @Param(value = "startMonth") int startMonth,
            @Param(value = "endYear") int endYear,
            @Param(value = "endMonth") int endMonth
    );

    Optional<MonthlyGroupExpense> findByExpenseYearAndExpenseMonthAndPetGroupId(int year, int month, long petGroupId);

    default MonthlyGroupExpense getByExpenseYearAndExpenseMonth(YearMonth yearMonth, long petGroupId) {
        return findByExpenseYearAndExpenseMonthAndPetGroupId(yearMonth.getYear(), yearMonth.getMonthValue(), petGroupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MONTHLY_GROUP_EXPENSE_NOT_FOUND));
    }
}
