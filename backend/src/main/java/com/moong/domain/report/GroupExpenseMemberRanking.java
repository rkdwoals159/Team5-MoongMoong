package com.moong.domain.report;

import com.moong.dto.response.memberexpense.MemberExpenseStatics;

public record GroupExpenseMemberRanking(
        String name,
        double ratio,
        long amount
) {

    public GroupExpenseMemberRanking(MonthlyMemberExpense monthlyMemberExpense, long totalAmount) {
        this(
                monthlyMemberExpense.getMember().getName(),
                Math.round((double) monthlyMemberExpense.getTotalAmount() / totalAmount * 1000) / 10.0,
                monthlyMemberExpense.getTotalAmount()
        );
    }

    public GroupExpenseMemberRanking(MemberExpenseStatics memberExpenseStatics, long totalAmount) {
        this(
                memberExpenseStatics.member().getName(),
                Math.round((double) memberExpenseStatics.totalAmount() / totalAmount * 1000) / 10.0,
                memberExpenseStatics.totalAmount()
        );
    }
}
