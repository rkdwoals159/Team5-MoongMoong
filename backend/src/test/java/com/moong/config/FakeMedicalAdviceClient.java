package com.moong.config;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.ai.TokenUsage;
import com.moong.client.medicaladvice.MedicalAdviceClient;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Profile("test")
@Primary
@Component
public class FakeMedicalAdviceClient implements MedicalAdviceClient {

    @Override
    public CompletableFuture<OpenAiResult<AiMedicalAdviceResponse>> getMedicalAdvice(
            AiMedicalAdviceRequest input,
            OpenAiModel aiModel
    ) {
        OpenAiResult<AiMedicalAdviceResponse> defaultResponse = new OpenAiResult<>(
                AiMedicalAdviceResponse.nonResponse(),
                TokenUsage.zeroUsage()
        );

        return CompletableFuture.completedFuture(defaultResponse);
    }
}
