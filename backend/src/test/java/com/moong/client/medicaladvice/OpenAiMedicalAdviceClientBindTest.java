package com.moong.client.medicaladvice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiProperties;
import com.moong.ai.OpenAiResult;
import com.moong.ai.prompt.MedicalAdvicePromptGenerator;
import com.moong.ai.prompt.MedicalAdvicePromptProperties;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class OpenAiMedicalAdviceClientBindTest {

    private MedicalAdviceClient medicalAdviceClient;
    private ExchangeFunction mockExchangeFunction;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockExchangeFunction = Mockito.mock(ExchangeFunction.class);
        objectMapper = new ObjectMapper();

        WebClient.Builder webClientBuilder = WebClient.builder()
                .exchangeFunction(mockExchangeFunction);
        MedicalAdvicePromptProperties promptProperties = new MedicalAdvicePromptProperties(
                "prompt-template", "system-prompt", "format-message");
        MedicalAdvicePromptGenerator promptGenerator = new MedicalAdvicePromptGenerator(promptProperties);
        OpenAiProperties openAiProperties = new OpenAiProperties("https://api.openai.com/v1", "testKey");
        medicalAdviceClient = new OpenAiMedicalAdviceClient(webClientBuilder, promptGenerator, openAiProperties, objectMapper);
    }

    @Nested
    class BindResult {

        @DisplayName("openAi 응답을 Result 객체에 바인딩할 수 있다")
        @Test
        void bindOpenAiResult() throws IOException, ExecutionException, InterruptedException, TimeoutException {
            String expectMedicalAdvice = "60%의 발생 확률로 인해 정기적인 안과 검진과 적절한 관리로 질병 예방에 힘쓰는 것이 중요합니다.";
            long expectedCost = 65000;
            int expectInputTokens = 491;
            int expectOutputTokens = 50;
            int expectTotalTokens = 541;
            AiMedicalAdviceRequest input = new AiMedicalAdviceRequest(Disease.CAR, 50, List.of(), 300);
            mockClient(HttpStatus.OK, "open-ai-response/advice_success.json");

            OpenAiResult<AiMedicalAdviceResponse> response = medicalAdviceClient.getMedicalAdvice(
                    input,
                    OpenAiModel.GPT_4_1_MINI_MODEL
            ).get(3L, TimeUnit.SECONDS);

            assertAll(
                    () -> assertThat(response.getResult().medicalAdvice()).isEqualTo(expectMedicalAdvice),
                    () -> assertThat(response.getResult().expectedCost()).isEqualTo(expectedCost),
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
