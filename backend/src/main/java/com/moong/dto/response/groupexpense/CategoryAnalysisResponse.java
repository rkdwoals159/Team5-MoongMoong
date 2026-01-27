package com.moong.dto.response.groupexpense;

import com.moong.domain.groupexpense.CategoryAnalysis;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Comparator;
import java.util.List;

@Schema(description = "카테고리별 소비 분석 응답")
public record CategoryAnalysisResponse(
        @Schema(description = "전체 소비 금액 합계", example = "320000")
        long total,

        @ArraySchema(
                schema = @Schema(implementation = CategoryCostResponse.class),
                arraySchema = @Schema(description = "카테고리별 소비 분석 목록 (소비 금액 기준 내림차순)")
        )
        List<CategoryCostResponse> categoryAnalysis
) {

    private static final Comparator<CategoryCostResponse> CATEGORY_COST_COMPARATOR = Comparator.comparingLong(CategoryCostResponse::cost).reversed();

    //TODO 반올림 문제 보정 필요
    public CategoryAnalysisResponse(CategoryAnalysis categoryAnalysis) {
        this(
                categoryAnalysis.getTotal(),
                categoryAnalysis.getMainCategoryCosts().entrySet().stream()
                        .map(entry -> new CategoryCostResponse(
                                entry.getKey(),
                                entry.getValue(),
                                getRatio(categoryAnalysis.getTotal(), entry.getValue())
                        ))
                        .sorted(CATEGORY_COST_COMPARATOR)
                        .toList()
        );
    }

    private static double getRatio(long total, long value) {
        if(total == 0) return 0;
        return Math.round((value * 1.0 / total) * 1000) / 10.0;
    }
}
