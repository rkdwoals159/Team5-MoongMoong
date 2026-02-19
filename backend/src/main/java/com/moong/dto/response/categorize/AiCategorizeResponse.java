package com.moong.dto.response.categorize;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;

public record AiCategorizeResponse(
        @JsonProperty(required = true) String mainCategory,
        @JsonProperty(required = true) String subCategory
) {

    public static AiCategorizeResponse noneCategory() {
        return new AiCategorizeResponse("기타", null);
    }

    public MainCategoryType getMainCategory() {
        return MainCategoryType.fromDescription(mainCategory);
    }

    public SubCategoryType getSubCategory() {
        return SubCategoryType.fromDescription(subCategory);
    }
}
