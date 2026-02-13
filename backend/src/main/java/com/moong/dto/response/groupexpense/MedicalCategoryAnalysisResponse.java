package com.moong.dto.response.groupexpense;

import com.moong.domain.enums.SubCategoryType;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

public record MedicalCategoryAnalysisResponse(
        long totalMedical,
        List<MedicalAnalysisResponse> medicalAnalysis
) {

    private static final Comparator<MedicalAnalysisResponse> MEDICAL_ANALYSIS_COMPARATOR = Comparator.comparingLong(
            MedicalAnalysisResponse::cost).reversed();

    public MedicalCategoryAnalysisResponse(long totalMedical, Map<SubCategoryType, Long> medicalStatics) {
        this(
                totalMedical,
                medicalStatics.entrySet().stream()
                        .map(entry -> new MedicalAnalysisResponse(
                                entry.getKey(),
                                entry.getValue(),
                                getRatio(totalMedical, entry.getValue())
                        ))
                        .sorted(MEDICAL_ANALYSIS_COMPARATOR)
                        .toList()
        );
    }

    //TODO Ratio 중복 코드 제거 + 반올림 보정문제 고민
    private static double getRatio(long total, long value) {
        if (total == 0) {
            return 0;
        }
        return Math.round((value * 1.0 / total) * 1000) / 10.0;
    }
}
