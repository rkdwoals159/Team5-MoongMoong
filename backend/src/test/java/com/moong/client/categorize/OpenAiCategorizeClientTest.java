package com.moong.client.categorize;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

@Disabled
@ActiveProfiles("test")
@SpringBootTest
class OpenAiCategorizeClientTest {

    @Autowired
    private OpenAiCategorizeClient openAiCategorizeClient;

    @Test
    void test() throws ExecutionException, InterruptedException, TimeoutException {
        CategorizeRequest request = new CategorizeRequest(
                "허리수술",
                UUID.randomUUID().toString()
        );
        CompletableFuture<OpenAiResult<AiCategorizeResponse>> categorize = openAiCategorizeClient.categorize(request,
                OpenAiModel.GPT_4_1_MODEL);

        OpenAiResult<AiCategorizeResponse> result = categorize.get(5, TimeUnit.SECONDS);
        System.out.println("mainCategory : " + result.getResult().mainCategory());
        System.out.println("subCategory : " + result.getResult().subCategory());
    }
}
