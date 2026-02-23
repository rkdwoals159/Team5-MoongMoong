package com.moong.domain.report;

import com.moong.dto.response.memberexpense.MemberExpenseStatics;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GroupExpenseMemberRankings {

    private static final int MAX_MEMBER_STATS_COUNT = 3;
    private static final Comparator<GroupExpenseMemberRanking> MEMBER_STAT_COMPARATOR = Comparator.comparing(
            GroupExpenseMemberRanking::amount).reversed();

    private final List<GroupExpenseMemberRanking> values;

    public static GroupExpenseMemberRankings fromMonthlyExpense(List<MonthlyMemberExpense> monthlyMemberExpenses) {
        long totalAmount = monthlyMemberExpenses.stream()
                .mapToLong(MonthlyMemberExpense::getTotalAmount)
                .sum();
        return monthlyMemberExpenses.stream()
                .map(memberExpense -> new GroupExpenseMemberRanking(memberExpense, totalAmount))
                .sorted(MEMBER_STAT_COMPARATOR)
                .limit(MAX_MEMBER_STATS_COUNT)
                .collect(Collectors.collectingAndThen(Collectors.toList(), GroupExpenseMemberRankings::new));
    }

    public static GroupExpenseMemberRankings fromMemberStatics(List<MemberExpenseStatics> memberExpenseStatics) {
        long totalAmount = memberExpenseStatics.stream()
                .mapToLong(MemberExpenseStatics::totalAmount)
                .sum();
        return memberExpenseStatics.stream()
                .map(memberExpense -> new GroupExpenseMemberRanking(memberExpense, totalAmount))
                .sorted(MEMBER_STAT_COMPARATOR)
                .limit(MAX_MEMBER_STATS_COUNT)
                .collect(Collectors.collectingAndThen(Collectors.toList(), GroupExpenseMemberRankings::new));
    }
}
