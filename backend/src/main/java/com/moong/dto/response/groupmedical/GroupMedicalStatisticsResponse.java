package com.moong.dto.response.groupmedical;

import com.moong.domain.enums.Disease;
import com.moong.domain.groupmedical.DiseaseStatistics;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

@Schema(description = "그룹 질병 통계 응답")
public record GroupMedicalStatisticsResponse(
        @Schema(description = "통계 시작 연도", example = "2026")
        long startYear,

        @ArraySchema(
                schema = @Schema(implementation = MedicalStatisticsResponse.class),
                arraySchema = @Schema(
                        description = "질병별 통계 목록"
                )
        )
        List<MedicalStatisticsResponse> statistics
) {

    public GroupMedicalStatisticsResponse(DiseaseStatistics diseaseStatistics) {
        this(
                LocalDate.now().getYear(),
                Stream.of(Disease.values())
                        .map(disease -> new MedicalStatisticsResponse(
                                disease,
                                diseaseStatistics.findDiseaseRatioHistory(disease))
                        ).toList()
        );
    }
}
