package com.moong.repository.monthlyexpense;

import com.moong.domain.report.MonthlyGroupExpense;
import java.util.List;

public interface MonthlyGroupExpenseJdbcRepository {

    void saveAllByBulkQuery(List<MonthlyGroupExpense> monthlyGroupExpenses);
}
