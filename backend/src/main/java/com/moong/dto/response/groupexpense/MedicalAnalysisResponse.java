package com.moong.dto.response.groupexpense;

public record MedicalAnalysisResponse(
        String subCategory,
        long cost,
        double ratio
) {

}
