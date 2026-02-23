package com.moong.repository.groupexpense;

import com.moong.domain.groupexpense.GroupExpense;
import java.util.List;

public interface GroupExpenseJdbcRepository {

    void saveAllByBulkQuery(List<GroupExpense> groupExpenses);
}
