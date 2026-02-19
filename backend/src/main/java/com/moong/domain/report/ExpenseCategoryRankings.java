package com.moong.domain.report;

import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.memberexpense.ExpenseCategoryStatics;
import java.util.Comparator;
import java.util.List;
import lombok.Getter;

@Getter
public class ExpenseCategoryRankings {

    private static final int CATEGORY_STAT_COUNT = 3;
    private static final Comparator<ExpenseCategoryRanking> CATEGORY_STAT_COMPARATOR = Comparator.comparing(
                    ExpenseCategoryRanking::amount)
            .reversed();

    private final List<ExpenseCategoryRanking> values;

    public ExpenseCategoryRankings(List<ExpenseCategoryStatics> categoryStatics) {
        long totalAmount = categoryStatics.stream()
                .mapToLong(ExpenseCategoryStatics::amount)
                .sum();
        this.values = categoryStatics.stream()
                .map(categoryExpense -> new ExpenseCategoryRanking(categoryExpense, totalAmount))
                .sorted(CATEGORY_STAT_COMPARATOR)
                .limit(CATEGORY_STAT_COUNT)
                .toList();
    }
}
