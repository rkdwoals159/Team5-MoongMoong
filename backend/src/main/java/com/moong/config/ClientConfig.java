package com.moong.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.logging.ai.WebClientLoggingFilter;
import io.netty.channel.ChannelOption;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class ClientConfig {

    private static final int CATEGORY_CLIENT_CONNECTION_TIMEOUT_MILLIS = 2000;
    private static final int CATEGORY_CLIENT_READ_TIMEOUT_MILLIS = 3000;

    @Bean
    public RestClient.Builder clientBuilder() {
        return RestClient.builder();
    }

    @Bean
    @Qualifier("categorizeClientBuilder")
    public WebClient.Builder categorizeClientBuilder(ObjectMapper objectMapper) {
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient()))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    private HttpClient httpClient() {
        return HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CATEGORY_CLIENT_CONNECTION_TIMEOUT_MILLIS)
                .responseTimeout(Duration.ofMillis(CATEGORY_CLIENT_READ_TIMEOUT_MILLIS));
    }

    private ExchangeStrategies registerJacksonMapper(ObjectMapper objectMapper) {
        return ExchangeStrategies.builder()
                .codecs(configurer -> {
                    configurer.defaultCodecs()
                            .jackson2JsonDecoder(new Jackson2JsonDecoder(objectMapper)
                            );
                    configurer.defaultCodecs()
                            .jackson2JsonEncoder(new Jackson2JsonEncoder(objectMapper));
                })
                .build();
    }

    @Bean
    @Qualifier("paymentClientBuilder")
    public WebClient.Builder paymentClientBuilder(ObjectMapper objectMapper) {
        return WebClient.builder()
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }
}
