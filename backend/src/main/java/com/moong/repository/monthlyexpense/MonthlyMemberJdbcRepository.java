package com.moong.repository.monthlyexpense;

import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.MonthlyMemberExpense;
import java.util.List;

public interface MonthlyMemberJdbcRepository {

    void saveAllByBulkQuery(List<MonthlyMemberExpense> monthlyMemberExpenses);
}
