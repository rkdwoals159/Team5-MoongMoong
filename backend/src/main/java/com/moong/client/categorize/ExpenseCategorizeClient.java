package com.moong.client.categorize;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import java.util.concurrent.CompletableFuture;

public interface ExpenseCategorizeClient {

    CompletableFuture<OpenAiResult<AiCategorizeResponse>> categorize(CategorizeRequest request, OpenAiModel aiModel);
}
