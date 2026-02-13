package com.moong.dto.response.groupexpense;

import com.moong.domain.enums.SubCategoryType;

public record MedicalAnalysisResponse(
        SubCategoryType subCategory,
        long cost,
        double ratio
) {

}
