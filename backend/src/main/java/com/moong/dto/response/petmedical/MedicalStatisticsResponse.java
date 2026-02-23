package com.moong.dto.response.petmedical;

import com.moong.domain.enums.Disease;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "질병별 통계 정보")
public record MedicalStatisticsResponse(
        @Schema(description = "질병 코드", example = "DER")
        Disease disease,

        @ArraySchema(arraySchema = @Schema(description = "질병 확률 리스트", example = "[12, 14, 16, 18, 20, 22, 24]"))
        List<Integer> ratios
) {

}
