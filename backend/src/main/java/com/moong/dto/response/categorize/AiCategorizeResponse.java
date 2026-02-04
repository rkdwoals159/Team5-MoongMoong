package com.moong.dto.response.categorize;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiCategorizeResponse(
        @JsonProperty(required = true) String mainCategory,
        @JsonProperty(required = true) String subCategory
) {

    public static AiCategorizeResponse noneCategory() {
        return new AiCategorizeResponse("기타", null);
    }

}
