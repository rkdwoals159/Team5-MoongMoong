package com.moong.dto.response.categorize;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "자동 카테고리 분류 응답")
public record CategorizeResponse(
        @Schema(description = "요청했던 id 값", example = "550e8400-e29b-41d4-a716-446655440000")
        String requestId,

        @Schema(description = "분류된 대분류", example = "의료")
        String mainCategory,

        @Schema(description = "분류된 소분류", example = "수술비")
        String subCategory
) {

}
