package com.moong.dto.response.memberexpense;
import com.moong.domain.memberexpense.MonthlyExpenseStats;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "지난달 소비내역 통계 응답")
public record LastMonthComparisonResponse(
        @Schema(description = "전월 대비 총 지출 변동률 (단위: %)", example = "-26", nullable = true)
        Integer totalRatio,

        @Schema(description = "전월 대비 의료비 지출 변동률 (단위: %)", example = "14", nullable = true)
        Integer medicalRatio,

        @Schema(description = "강아지 이름", example = "코코")
        String petName,

        @Schema(description = "강아지 사진 URL", example = "https://avatars.githubusercontent.com/u/148152234?v=4")
        String petImageUrl
) {

    public LastMonthComparisonResponse(MonthlyExpenseStats monthlyStats, String petName, String imageUrl) {
        this(
                monthlyStats.getTotalRatio(),
                monthlyStats.getMedicalRatio(),
                petName,
                imageUrl
        );
    }
}
