package com.moong.client.categorize;

import com.moong.ai.OpenAiProperties;
import com.moong.ai.OpenAiResult;
import com.moong.ai.prompt.CategorizePromptGenerator;
import com.moong.dto.request.categorize.OpenAiRequest;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Component
@EnableConfigurationProperties(OpenAiProperties.class)
public class OpenAiCategorizeClient implements ExpenseCategorizeClient {

    private final WebClient webClient;
    private final CategorizePromptGenerator promptGenerator;
    private final OpenAiProperties properties;

    public OpenAiCategorizeClient(
            @Qualifier("categorizeClientBuilder")
            WebClient.Builder webClientBuilder,
            CategorizePromptGenerator promptGenerator,
            OpenAiProperties properties
    ) {
        this.webClient = webClientBuilder
                .baseUrl(properties.baseUrl())
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.promptGenerator = promptGenerator;
        this.properties = properties;
    }

    @Override
    public CompletableFuture<OpenAiResult<AiCategorizeResponse>> categorize(CategorizeRequest request, String model) {
        String prompt = promptGenerator.generate(request.usage());
        OpenAiRequest aiRequest = new OpenAiRequest(model, prompt);
        return webClient.post()
                .uri("/responses")
                .bodyValue(aiRequest)
                .headers(headers -> headers.setBearerAuth(properties.secretKey()))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<OpenAiResult<AiCategorizeResponse>>() {
                })
                .toFuture();
    }
}
