package com.moong.exception.analyzer.messagesender;

import com.moong.exception.dto.AnalyzeErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
public class ErrorAnalyzeSlackMessageSender implements ErrorAnalyzeMessageSender {

    private final WebClient webClient;
    private final SlackMessageResolver slackMessageResolver;
    private final ErrorAnalyzeSlackProperties properties;

    public ErrorAnalyzeSlackMessageSender(
            WebClient.Builder webClientBuilder,
            SlackMessageResolver slackMessageResolver,
            ErrorAnalyzeSlackProperties properties
    ) {
        this.webClient = webClientBuilder.build();
        this.slackMessageResolver = slackMessageResolver;
        this.properties = properties;
    }

    @Override
    public void send(AnalyzeErrorResponse response) {
        SlackMessage message = slackMessageResolver.resolve(response);
        log.info("Sending error analysis response: {}", message.toString());
        webClient.post()
                .uri(properties.clientErrorWebHookUrl())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(message)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(result -> log.info("Slack Send Success: {}", result))
                .doOnError(result -> log.warn("Slack Send Error: {}", result.getMessage()))
                .subscribe();
    }
}
