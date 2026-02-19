package com.moong.domain.report;

import com.moong.dto.response.memberexpense.ExpenseCategoryStatics;

public record ExpenseCategoryRanking(
        String category,
        double ratio,
        long amount
) {
    public ExpenseCategoryRanking(ExpenseCategoryStatics statics, long totalAmount) {
        this(
                statics.mainCategory().getDescription(),
                Math.round((double) statics.amount() / totalAmount * 1000) / 10.0,
                statics.amount()
        );
    }
}
