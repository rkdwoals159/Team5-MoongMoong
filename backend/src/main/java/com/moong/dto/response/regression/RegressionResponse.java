package com.moong.dto.response.regression;

public record RegressionResponse(
        double slope,
        double intercept,
        double rValue,
        long prediction,
        long minPrediction,
        long maxPrediction
) {

}
