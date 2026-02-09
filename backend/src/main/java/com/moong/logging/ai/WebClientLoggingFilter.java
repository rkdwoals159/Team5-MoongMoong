package com.moong.logging.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;

@Slf4j
public class WebClientLoggingFilter {

    private static final String REQUEST_HEADER_LOGGING_MESSAGE = "[WebClient Request Header]";
    private static final String RESPONSE_HEADER_LOGGING_MESSAGE = "[WebClient Response Header]";

    public static ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(request -> {
            log.info("[WebClient Request] {} {}", request.method(), request.url());
            loggingHeader(REQUEST_HEADER_LOGGING_MESSAGE, request.headers());
            return Mono.just(request);
        });
    }

    public static ExchangeFilterFunction logResponseWithBody() {
        return ExchangeFilterFunction.ofResponseProcessor(response -> {
            HttpStatusCode status = response.statusCode();
            HttpHeaders headers = response.headers().asHttpHeaders();
            return response.bodyToMono(String.class)
                    .defaultIfEmpty("")
                    .doOnNext(body -> {
                        log.info("[WebClient Response] Status={}", status);
                        loggingHeader(RESPONSE_HEADER_LOGGING_MESSAGE, headers);
                        log.info("[WebClient Response Body] {}", body);
                    })
                    .map(body -> ClientResponse //바디 스트림 소모되면 다시 못읽으므로 복구
                            .create(status)
                            .headers(headerComponents -> headerComponents.addAll(headers))
                            .body(body)
                            .build()
                    );
        });
    }

    private static void loggingHeader(String loggingMessage, HttpHeaders headers) {
        headers.forEach((name, values) ->
                values.forEach(value ->
                        log.debug(loggingMessage +" {}={}", name, value)
                )
        );
    }
}

