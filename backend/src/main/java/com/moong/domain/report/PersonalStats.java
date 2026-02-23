package com.moong.domain.report;

import com.moong.dto.response.regression.RegressionResponse;
import java.util.List;

public record PersonalStats(
        long totalAmount,
        long dailyAvgAmount,
        long changeRate,
        int daysInMonth,
        long predictedAmount,
        long predictMargin,
        long predictMin,
        long predictMax,
        List<ExpenseCategoryRanking> topCategories
) {

    public PersonalStats(
            MonthlyMemberExpense monthlyMemberExpense,
            RegressionResponse regressionResponse,
            long changeRate,
            int daysInMonth,
            ExpenseCategoryRankings categoryStats
    ) {
        this(
                monthlyMemberExpense.getTotalAmount(),
                monthlyMemberExpense.getDailyAverageAmount(),
                changeRate,
                daysInMonth,
                regressionResponse.prediction(),
                regressionResponse.margin(),
                regressionResponse.minPrediction(),
                regressionResponse.maxPrediction(),
                categoryStats.getValues()
        );
    }

    public PersonalStats(
            long totalAmount,
            long dailyAvgAmount,
            long changeRate,
            int daysInMonth,
            RegressionResponse regressionResponse,
            ExpenseCategoryRankings categoryStats
    ) {
        this(
                totalAmount,
                dailyAvgAmount,
                changeRate,
                daysInMonth,
                regressionResponse.prediction(),
                regressionResponse.margin(),
                regressionResponse.minPrediction(),
                regressionResponse.maxPrediction(),
                categoryStats.getValues()
        );
    }
}

