package com.moong.dto.response.groupmedical;

import com.moong.domain.entity.Treatment;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record TreatmentsResponse(
        @ArraySchema(
                schema = @Schema(implementation = TreatmentResponse.class),
                arraySchema = @Schema(description = "특정 질병의 의료비 데이터 리스트 응답")
        )
        List<TreatmentResponse> treatments
) {
    public static TreatmentsResponse from(List<Treatment> treatments) {
        return new TreatmentsResponse(treatments.stream()
                .map(TreatmentResponse::new)
                .toList());
    }
}
