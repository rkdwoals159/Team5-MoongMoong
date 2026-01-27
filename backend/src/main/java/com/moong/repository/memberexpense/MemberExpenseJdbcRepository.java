package com.moong.repository.memberexpense;

import com.moong.domain.entity.MemberExpense;
import java.util.List;

public interface MemberExpenseJdbcRepository {

    void saveAllByBulkQuery(List<MemberExpense> memberExpense);

    void updateAllByBulkQuery(List<MemberExpense> memberExpense);
}
