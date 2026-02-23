package com.moong.domain.report;

import com.moong.dto.response.regression.RegressionResponse;
import java.util.List;

public record GroupStats(
        long totalAmount,
        long dailyAvgAmount,
        long predictedAmount,
        long predictMargin,
        long predictMin,
        long predictMax,
        List<GroupExpenseMemberRanking> members,
        List<ExpenseCategoryRanking> topCategories
) {

    public GroupStats(
            MonthlyGroupExpense monthlyGroupExpense,
            RegressionResponse regressionResponse,
            GroupExpenseMemberRankings memberStats,
            ExpenseCategoryRankings categoryStats
    ) {
        this(
                monthlyGroupExpense.getTotalAmount(),
                monthlyGroupExpense.getAverageDailyAmount(),
                regressionResponse.prediction(),
                regressionResponse.margin(),
                regressionResponse.minPrediction(),
                regressionResponse.maxPrediction(),
                memberStats.getValues(),
                categoryStats.getValues()
        );
    }

    public GroupStats(
            long totalAmount,
            long dailyAvgAmount,
            RegressionResponse regressionResponse,
            GroupExpenseMemberRankings memberStats,
            ExpenseCategoryRankings categoryStats
    ) {
        this(
                totalAmount,
                dailyAvgAmount,
                regressionResponse.prediction(),
                regressionResponse.margin(),
                regressionResponse.minPrediction(),
                regressionResponse.maxPrediction(),
                memberStats.getValues(),
                categoryStats.getValues()
        );
    }
}
