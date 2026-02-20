package com.moong.config;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.ai.TokenUsage;
import com.moong.client.categorize.ExpenseCategorizeClient;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Profile("test")
@Primary
@Component
public class FakeCategorizeClient implements ExpenseCategorizeClient {

    @Override
    public CompletableFuture<OpenAiResult<AiCategorizeResponse>> categorize(CategorizeRequest request, OpenAiModel aiModel) {
        OpenAiResult<AiCategorizeResponse> defaultResponse = new OpenAiResult<>(
                AiCategorizeResponse.noneCategory(),
                TokenUsage.zeroUsage()
        );
        return CompletableFuture.completedFuture(defaultResponse);
    }
}
