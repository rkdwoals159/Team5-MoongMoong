package com.moong.domain.groupexpense;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.MemberExpense;

import java.time.Month;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GroupExpenses {

    private final List<GroupExpense> expenses;

    public GroupExpenses(List<GroupExpense> expenses) {
        this.expenses = expenses;
    }

    public long averageMonthlyCost() {
        Map<Month, Long> monthlySum = expenses.stream()
                .map(GroupExpense::getMemberExpense)
                .collect(Collectors.groupingBy(
                        me -> me.getSpentAtMonth(),
                        Collectors.summingLong(MemberExpense::getCost)
                ));

        return (long) monthlySum.values().stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);
    }
}
