package com.moong.fixture;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.repository.monthlyexpense.MonthlyMemberExpenseRepository;
import java.time.YearMonth;
import org.springframework.stereotype.Component;

@Component
public class MonthlyMemberExpenseGenerator {

    private final MonthlyMemberExpenseRepository monthlyMemberExpenseRepository;

    public MonthlyMemberExpenseGenerator(MonthlyMemberExpenseRepository monthlyMemberExpenseRepository) {
        this.monthlyMemberExpenseRepository = monthlyMemberExpenseRepository;
    }

    public MonthlyMemberExpense generate(Member member, YearMonth yearMonth, long totalAmount) {
        MonthlyMemberExpense expense = new MonthlyMemberExpense(yearMonth, totalAmount, member);
        return monthlyMemberExpenseRepository.save(expense);
    }
}
