package com.moong.client.categorize;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiProperties;
import com.moong.ai.OpenAiResult;
import com.moong.ai.prompt.CategorizePromptGenerator;
import com.moong.ai.prompt.CategorizePromptProperties;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

class OpenAiCategorizeClientBindTest {

    private ExpenseCategorizeClient expenseCategorizeClient;
    private ExchangeFunction mockExchangeFunction;

    @BeforeEach
    void setUp() {
        mockExchangeFunction = Mockito.mock(ExchangeFunction.class);

        WebClient.Builder webClientBuilder = WebClient.builder()
                .exchangeFunction(mockExchangeFunction);
        CategorizePromptProperties promptProperties = new CategorizePromptProperties("prompt", "system", "format");
        CategorizePromptGenerator promptGenerator = new CategorizePromptGenerator(promptProperties);
        OpenAiProperties openAiProperties = new OpenAiProperties("https://api.openai.com/v1", "testKey");
        expenseCategorizeClient = new OpenAiCategorizeClient(webClientBuilder, promptGenerator, openAiProperties);
    }

    @Nested
    class BindResult {

        @DisplayName("openAi 응답을 Result 객체에 바인딩할 수 있다")
        @Test
        void bindOpenAiResult() throws IOException, ExecutionException, InterruptedException, TimeoutException {
            String expectMainCategory = "의료비";
            String expectSubCategory = "수술비";
            int expectInputTokens = 328;
            int expectOutputTokens = 691;
            int expectTotalTokens = 1019;
            CategorizeRequest request = new CategorizeRequest("허리 수술", UUID.randomUUID().toString());
            mockClient(HttpStatus.OK, "open-ai-response/success.json");

            OpenAiResult<AiCategorizeResponse> response = expenseCategorizeClient.categorize(
                    request,
                    OpenAiModel.GPT_4_1_MODEL.getModel()
            ).get(3L, TimeUnit.SECONDS);

            assertAll(
                    () -> assertThat(response.getResult().mainCategory()).isEqualTo(expectMainCategory),
                    () -> assertThat(response.getResult().subCategory()).isEqualTo(expectSubCategory),
                    () -> assertThat(response.getTokenUsage().inputToken()).isEqualTo(expectInputTokens),
                    () -> assertThat(response.getTokenUsage().outputToken()).isEqualTo(expectOutputTokens),
                    () -> assertThat(response.getTokenUsage().totalToken()).isEqualTo(expectTotalTokens)
            );
        }

        private void mockClient(HttpStatus status, String responsePath) throws IOException {
            String responseBody = makeResponseByPath(responsePath);
            Mockito.when(mockExchangeFunction.exchange(Mockito.any()))
                    .thenReturn(Mono.just(ClientResponse.create(status)
                            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .body(responseBody)
                            .build())
                    );
        }

        private String makeResponseByPath(String path) throws IOException {
            return new String(Files.readAllBytes(
                    new ClassPathResource(path).getFile().toPath())
            );
        }
    }


}
