package com.moong.domain.medicaladvice;

import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.Year;

@Getter
@RequiredArgsConstructor
public class AiMedicalAdvice {

    private final long groupId;
    private final String medicalAdvice;
    private final long expectedCost;
    private final int nextYear;

    public AiMedicalAdvice(AiMedicalAdviceResponse response,
                           long groupId,
                           Year year) {
        this(
                groupId,
                response.medicalAdvice(),
                response.expectedCost(),
                year.getValue()
        );
    }
}
