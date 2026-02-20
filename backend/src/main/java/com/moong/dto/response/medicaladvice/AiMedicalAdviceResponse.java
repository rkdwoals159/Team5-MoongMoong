package com.moong.dto.response.medicaladvice;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiMedicalAdviceResponse(
        @JsonProperty(required = true) String medicalAdvice,
        @JsonProperty(required = true) long expectedCost
) {

    public static AiMedicalAdviceResponse nonResponse() {
        return new AiMedicalAdviceResponse("의사 권장사항이 존재하지 않습니다.", 0);
    }
}
