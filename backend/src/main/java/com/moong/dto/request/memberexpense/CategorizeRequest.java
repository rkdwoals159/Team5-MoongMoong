package com.moong.dto.request.memberexpense;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "자동 카테고리 분류 요청")
public record CategorizeRequest(
        @Schema(description = "사용한 지출내역", example = "뚱이 허리 수술")
        String usage,

        @Schema(description = "요청 id 값", example = "550e8400-e29b-41d4-a716-446655440000")
        String requestId
) {

}
