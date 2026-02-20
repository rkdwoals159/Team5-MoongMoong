package com.moong.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.logging.ai.WebClientLoggingFilter;
import io.netty.channel.ChannelOption;
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
import java.time.Duration;

@Configuration
public class ClientConfig {

    private static final int CATEGORY_CLIENT_CONNECTION_TIMEOUT_MILLIS = 2000;
    private static final int CATEGORY_CLIENT_READ_TIMEOUT_MILLIS = 3000;
    private static final int LLM_ANALYZER_CONNECTION_TIMEOUT = 10000;
    private static final int LLM_ANALYZER_READ_TIMEOUT = 60000;
    private static final int SLACK_SENDER_CONNECTION_TIMEOUT = 5000;
    private static final int SLACK_SENDER_READ_TIMEOUT = 10000;
    private static final int ADVICE_CLIENT_CONNECTION_TIMEOUT = 5000;
    private static final int ADVICE_CLIENT_READ_TIMEOUT = 10000;
    private static final int PET_MEDICAL_CLIENT_CONNECTION_TIMEOUT = 10000;
    private static final int PET_MEDICAL_CLIENT_READ_TIMEOUT = 10000;

    @Bean
    public RestClient.Builder clientBuilder() {
        return RestClient.builder();
    }

    @Bean
    @Qualifier("llmAnalyzerClientBuilder")
    public WebClient.Builder llmAnalayzeClientBuilder(ObjectMapper objectMapper) {
        HttpClient llmAnalyzeHttpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, LLM_ANALYZER_CONNECTION_TIMEOUT)
                .responseTimeout(Duration.ofMillis(LLM_ANALYZER_READ_TIMEOUT));

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(llmAnalyzeHttpClient))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    @Bean
    @Qualifier("slackClientBuilder")
    public WebClient.Builder slackClientBuilder(ObjectMapper objectMapper) {
        HttpClient slackHttpClient = HttpClient.create()
                .responseTimeout(Duration.ofMillis(SLACK_SENDER_READ_TIMEOUT))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, SLACK_SENDER_CONNECTION_TIMEOUT);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(slackHttpClient))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    @Bean
    @Qualifier("petMedicalClientBuilder")
    public WebClient.Builder petMedicalClientBuilder(ObjectMapper objectMapper) {
        HttpClient petMedicalClient = HttpClient.create()
                .responseTimeout(Duration.ofMillis(PET_MEDICAL_CLIENT_READ_TIMEOUT))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, PET_MEDICAL_CLIENT_CONNECTION_TIMEOUT);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(petMedicalClient))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    @Bean
    @Qualifier("categorizeClientBuilder")
    public WebClient.Builder categorizeClientBuilder(ObjectMapper objectMapper) {
        HttpClient categorizeHttpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CATEGORY_CLIENT_CONNECTION_TIMEOUT_MILLIS)
                .responseTimeout(Duration.ofMillis(CATEGORY_CLIENT_READ_TIMEOUT_MILLIS));

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(categorizeHttpClient))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    @Bean
    @Qualifier("medicalAdviceClientBuilder")
    public WebClient.Builder medicalAdviceClientBuilder(ObjectMapper objectMapper) {
        HttpClient medicalAdviceClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, ADVICE_CLIENT_CONNECTION_TIMEOUT)
                .responseTimeout(Duration.ofMillis(ADVICE_CLIENT_READ_TIMEOUT));

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(medicalAdviceClient))
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
    }

    @Bean
    @Qualifier("paymentClientBuilder")
    public WebClient.Builder paymentClientBuilder(ObjectMapper objectMapper) {
        return WebClient.builder()
                .exchangeStrategies(registerJacksonMapper(objectMapper))
                .filter(WebClientLoggingFilter.logRequest())
                .filter(WebClientLoggingFilter.logResponseWithBody());
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
}
