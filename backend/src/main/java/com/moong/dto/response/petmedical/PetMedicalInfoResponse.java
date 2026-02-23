package com.moong.dto.response.petmedical;

import com.moong.domain.groupmedical.GroupMedicalAdvice;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "그룹 의사 권장사항 응답")
public record PetMedicalInfoResponse(
        @Schema(description = "내년 연간 예상 비용", example = "125000")
        long expectedCost,

        @Schema(description = "AI 의료 권장사항",
                example = "내년에는 정기 건강검진 주기를 단축하고 혈액·영상 검사를 병행하는 것을 권장합니다.")
        String advice,

        @Schema(description = "내년", example = "2027")
        int year
){

    public PetMedicalInfoResponse(GroupMedicalAdvice groupMedicalAdvice) {
        this(
            groupMedicalAdvice.getExpectedCost(),
            groupMedicalAdvice.getAdvice(),
            groupMedicalAdvice.getYear()
        );
    }
}
