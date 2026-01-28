package com.moong.dto.response.groupmedical;

import com.moong.domain.entity.Treatment;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "특정 질병의 의료비 데이터 응답")
public record TreatmentResponse(

        @Schema(description = "진료명", example = "곰팡이성 피부염")
        String name,

        @Schema(description = "상세 진료 설명", example = "피부 트러블, 설사·구토, 세균·바이러스 감염 등")
        String description,

        @Schema(description = "최소 값", example = "45000")
        int minPrice,

        @Schema(description = "최대 값", example = "120000")
        int maxPrice,

        @Schema(description = "평균 값", example = "68000")
        int averagePrice
) {
    public TreatmentResponse(Treatment treatment) {
        this(
                treatment.getName(),
                treatment.getDescription(),
                treatment.getMinPrice(),
                treatment.getMaxPrice(),
                treatment.getAveragePrice()
        );
    }
}
