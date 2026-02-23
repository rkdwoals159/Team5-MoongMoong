package com.moong.fixture;

import com.moong.domain.report.MonthlyGroupExpense;
import com.moong.repository.monthlyexpense.MonthlyGroupExpenseRepository;
import java.time.YearMonth;
import org.springframework.stereotype.Component;

@Component
public class MonthlyGroupExpenseGenerator {

    private final MonthlyGroupExpenseRepository monthlyGroupExpenseRepository;

    public MonthlyGroupExpenseGenerator(MonthlyGroupExpenseRepository monthlyGroupExpenseRepository) {
        this.monthlyGroupExpenseRepository = monthlyGroupExpenseRepository;
    }

    public MonthlyGroupExpense generate(YearMonth yearMonth, long petGroupId, long amount) {
        return monthlyGroupExpenseRepository.save(
                new MonthlyGroupExpense(yearMonth, amount, petGroupId)
        );
    }
}
