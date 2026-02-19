package com.moong.repository.monthlyexpense;

import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.report.MonthlyExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface MonthlyMemberExpenseRepository
        extends Repository<MonthlyMemberExpense, Long>, MonthlyMemberJdbcRepository {

    MonthlyMemberExpense save(MonthlyExpense monthlyExpense);

    @Query("""
    select m
     from MonthlyMemberExpense m
     join fetch m.member
     where m.member.id in :memberIds
         and m.expenseYear = :expenseYear
         and m.expenseMonth = :expenseMonth
    """)
    List<MonthlyMemberExpense> findMonthlyMemberExpensesBetweenWithFetchedMember(
            long expenseYear,
            long expenseMonth,
            List<Long> memberIds
    );

    @Query("""
            select coalesce(sum(me.totalAmount), 0)
            from MonthlyMemberExpense me
            where me.member.id in :memberIds and me.expenseYear = :expenseYear and me.expenseMonth = :expenseMonth
            """)
    long sumAllByMemberIdIsIn(List<Long> memberIds, long expenseYear, long expenseMonth);

    @Query("""
            select m
            from MonthlyMemberExpense m
            where m.member.id = :memberId
              and ((m.expenseYear > :startYear or (m.expenseYear = :startYear and m.expenseMonth >= :startMonth)))
              and ((m.expenseYear < :endYear or (m.expenseYear = :endYear and m.expenseMonth <= :endMonth)))
            order by m.expenseYear, m.expenseMonth
            """)
    List<MonthlyMemberExpense> findByMemberIdBetween(
            @Param(value = "memberId") long memberId,
            @Param(value = "startYear") int startYear,
            @Param(value = "startMonth") int startMonth,
            @Param(value = "endYear") int endYear,
            @Param(value = "endMonth") int endMonth
    );

    Optional<MonthlyMemberExpense> findByExpenseYearAndExpenseMonthAndMemberId(int year, int month, long memberId);

    default MonthlyMemberExpense getByExpenseYearAndExpenseMonth(YearMonth yearMonth, long memberId) {
        return findByExpenseYearAndExpenseMonthAndMemberId(yearMonth.getYear(), yearMonth.getMonthValue(), memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MONTHLY_MEMBER_EXPENSE_NOT_FOUND));
    }
}
