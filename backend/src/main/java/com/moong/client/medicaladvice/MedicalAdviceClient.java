package com.moong.client.medicaladvice;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;

import java.util.concurrent.CompletableFuture;

public interface MedicalAdviceClient {

    CompletableFuture<OpenAiResult<AiMedicalAdviceResponse>> getMedicalAdvice(AiMedicalAdviceRequest input, OpenAiModel model);
}
