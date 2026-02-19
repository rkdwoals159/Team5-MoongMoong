package com.moong.service;

import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.report.MonthlyExpenseRegressionAnalyzer;
import com.moong.dto.response.regression.RegressionResponse;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import com.moong.repository.monthlyexpense.MonthlyMemberExpenseRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonthlyMemberExpenseService {

    private final MonthlyMemberExpenseRepository monthlyMemberExpenseRepository;
    private final MemberExpenseRepository memberExpenseRepository;
    private final MonthlyExpenseRegressionAnalyzer regressionAnalyzer;

    public void saveAllMonthlyMemberExpense(YearMonth yearMonth) {
        LocalDate monthStartDate = yearMonth.atDay(1);
        LocalDate nextMonthStartDate = yearMonth.atEndOfMonth().plusDays(1);
        List<MonthlyMemberExpense> monthlyMemberExpenses = findMonthlyMemberExpenseBetween(yearMonth, monthStartDate, nextMonthStartDate);
        monthlyMemberExpenseRepository.saveAllByBulkQuery(monthlyMemberExpenses);
    }

    private List<MonthlyMemberExpense> findMonthlyMemberExpenseBetween(
            YearMonth yearMonth,
            LocalDate monthStartDate,
            LocalDate nextMonthStartDate
    ) {
        return memberExpenseRepository.findMemberExpenseStaticsBetween(
                        monthStartDate, nextMonthStartDate
                ).stream()
                .map(statics -> new MonthlyMemberExpense(
                        yearMonth,
                        statics.totalAmount(),
                        statics.member()
                ))
                .toList();
    }

    public RegressionResponse getMemberExpensePrediction(YearMonth start, YearMonth end, long memberId) {
        List<MonthlyMemberExpense> monthlyExpenses = monthlyMemberExpenseRepository.findByMemberIdBetween(
                memberId,
                start.getYear(),
                start.getMonthValue(),
                end.getYear(),
                end.getMonthValue()
        );
        return regressionAnalyzer.predict(monthlyExpenses);
    }

    public MonthlyMemberExpense getByExpenseYearAndExpenseMonth(YearMonth yearMonth, long groupId) {
        return monthlyMemberExpenseRepository.getByExpenseYearAndExpenseMonth(yearMonth, groupId);
    }

    public Optional<MonthlyMemberExpense> findByExpenseYearAndExpenseMonth(YearMonth yearMonth, long groupId) {
        return monthlyMemberExpenseRepository.findByExpenseYearAndExpenseMonthAndMemberId(
                yearMonth.getYear(),
                yearMonth.getMonthValue(),
                groupId
        );
    }
}
