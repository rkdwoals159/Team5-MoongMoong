package com.moong.repository.monthlyexpense;

import com.moong.domain.report.MonthlyMemberExpense;
import java.util.List;

public interface MonthlyMemberJdbcRepository {

    void saveAllByBulkQuery(List<MonthlyMemberExpense> monthlyMemberExpenses);
}
