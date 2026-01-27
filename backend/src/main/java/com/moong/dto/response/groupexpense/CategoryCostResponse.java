package com.moong.dto.response.groupexpense;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "카테고리별 소비 금액 및 비율 정보")
public record CategoryCostResponse(

        @Schema(description = "소비 카테고리 식별자", example = "의료비")
        String category,

        @Schema(description = "해당 카테고리의 총 소비 금액", example = "185000")
        long cost,

        @Schema(
                description = "전체 소비 대비 해당 카테고리의 소비 비율 (소수점 첫째 자리까지)",
                example = "42.3"
        )
        double ratio
) {
}
