package com.moong.client.medicaladvice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.ai.OpenAiModel;
import com.moong.config.ai.OpenAiProperties;
import com.moong.ai.OpenAiResult;
import com.moong.ai.prompt.MedicalAdvicePromptGenerator;
import com.moong.dto.request.categorize.OpenAiRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
@EnableConfigurationProperties(OpenAiProperties.class)
public class OpenAiMedicalAdviceClient implements MedicalAdviceClient {

    private final WebClient webClient;
    private final MedicalAdvicePromptGenerator promptGenerator;
    private final OpenAiProperties properties;
    private final ObjectMapper objectMapper;

    public OpenAiMedicalAdviceClient(
            @Qualifier("medicalAdviceClientBuilder")
            WebClient.Builder webClientBuilder,
            MedicalAdvicePromptGenerator promptGenerator,
            OpenAiProperties properties,
            ObjectMapper objectMapper
    ){
        this.webClient = webClientBuilder
                .baseUrl(properties.baseUrl())
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.promptGenerator = promptGenerator;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public CompletableFuture<OpenAiResult<AiMedicalAdviceResponse>> getMedicalAdvice(
            AiMedicalAdviceRequest input,
            OpenAiModel aiModel
    ) {
        String treatmentsJson;
        try {
            treatmentsJson = objectMapper.writeValueAsString(input.treatmentAvgCosts());
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.TREATMENT_AVG_COST_SERIALIZED_ERROR);
        }

        String prompt = promptGenerator.generate(
                input.disease().getKoreanName(),
                input.ratio(),
                treatmentsJson,
                input.avgMedicalExpense()
        );

        log.info("PROMPT = {}", prompt);

        OpenAiRequest aiRequest = new OpenAiRequest(aiModel.getModel(), prompt);
        return webClient.post()
                .uri("/responses")
                .bodyValue(aiRequest)
                .headers(headers -> headers.setBearerAuth(properties.secretKey()))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<OpenAiResult<AiMedicalAdviceResponse>>() {
                })
                .doOnNext(res -> log.info("OpenAI response = {}", res))
                .doOnError(e -> log.error("OpenAI bind/receive error", e))
                .toFuture();
    }
}
