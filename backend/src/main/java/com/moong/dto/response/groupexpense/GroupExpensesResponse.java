package com.moong.dto.response.groupexpense;

import com.moong.domain.entity.GroupExpense;
import java.util.List;

public record GroupExpensesResponse(
        long total,
        List<GroupExpenseResponse> expenses
) {

    public GroupExpensesResponse(List<GroupExpense> expenses) {
        this(
                expenses.stream()
                        .mapToLong(GroupExpense::getCost)
                        .sum(),
                expenses.stream()
                        .map(GroupExpenseResponse::new)
                        .toList()
        );
    }
}
