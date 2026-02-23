package com.moong.client.payment;

import com.moong.config.payment.TossProperties;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.TossCancelRequest;
import com.moong.dto.response.payment.TossCancelResponse;
import com.moong.dto.response.payment.TossConfirmResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@EnableConfigurationProperties(TossProperties.class)
public class TossPaymentClient {

    private final WebClient webClient;
    private final TossProperties tossProperties;

    public TossPaymentClient(
            @Qualifier("paymentClientBuilder")
            WebClient.Builder webClientBuilder,
            TossProperties tossProperties
    ) {
        this.webClient = webClientBuilder
                .baseUrl(tossProperties.baseUrl())
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.tossProperties = tossProperties;
    }

    public CompletableFuture<TossConfirmResponse> confirm(CoinPaymentConfirmRequest request) {
        return webClient.post()
                .uri("/confirm")
                .headers(headers -> headers.setBasicAuth(tossProperties.secretKey(), ""))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(TossConfirmResponse.class)
                .onErrorResume(WebClientResponseException.class, this::handleTossError)
                .toFuture();
    }

    public CompletableFuture<TossCancelResponse> cancel(String paymentKey, TossCancelRequest request) {
        return webClient.post()
                .uri("/{paymentKey}/cancel",  paymentKey)
                .headers(headers -> headers.setBasicAuth(tossProperties.secretKey(), ""))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(TossCancelResponse.class)
                .onErrorResume(WebClientResponseException.class, this::handleTossError)
                .toFuture();
    }

    private <T> Mono<T> handleTossError(WebClientResponseException e) {
        log.error("Toss Payment API error - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
        if (e.getStatusCode().is5xxServerError()) {
            return Mono.error(new BusinessException(ErrorCode.TOSS_PAYMENT_SERVER_ERROR));
        }
        return Mono.error(new BusinessException(ErrorCode.TOSS_PAYMENT_CLIENT_ERROR));
    }
}
