package com.moong.dto.response.groupexpense;

import com.moong.domain.groupexpense.GroupExpenseDetail;
import java.util.List;

public record GroupExpensesResponse(
        long total,
        List<GroupExpenseResponse> expenses
) {

    public GroupExpensesResponse(List<GroupExpenseDetail> expenses) {
        this(
                expenses.stream()
                        .mapToLong(GroupExpenseDetail::getCost)
                        .sum(),
                expenses.stream()
                        .map(GroupExpenseResponse::new)
                        .toList()
        );
    }
}
