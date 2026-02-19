package com.moong.dto.response.regression;

import java.util.List;

public record RegressionResponse(
        double slope,
        double intercept,
        double rValue,
        long margin,
        long prediction,
        long minPrediction,
        long maxPrediction
) {

    public static RegressionResponse defaultResponse(List<Long> amounts) {
        if (amounts.isEmpty()) {
            return new RegressionResponse(
                    0.0, 0.0, 0.0, 0L, 0L, 0L, 0L
            );
        }
        long avg = Math.round(
                amounts.stream()
                        .mapToLong(Long::longValue)
                        .average()
                        .orElse(0.0)
        );
        return new RegressionResponse(0.0, avg, 0.0, 0L, avg, avg, avg);
    }
}
