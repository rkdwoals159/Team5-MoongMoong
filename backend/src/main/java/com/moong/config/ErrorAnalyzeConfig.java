package com.moong.config;

import com.moong.exception.analyzer.ConsoleErrorAnalyzer;
import com.moong.exception.analyzer.ErrorAnalyzer;
import com.moong.exception.analyzer.LlmErrorAnalyzer;
import com.moong.exception.analyzer.LlmProperties;
import com.moong.exception.analyzer.messagesender.ConsoleAnalyzeMessageSender;
import com.moong.exception.analyzer.messagesender.ErrorAnalyzeMessageSender;
import com.moong.exception.analyzer.messagesender.ErrorAnalyzeSlackMessageSender;
import com.moong.exception.analyzer.messagesender.ErrorAnalyzeSlackProperties;
import com.moong.exception.analyzer.messagesender.SlackMessageResolver;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.reactive.function.client.WebClient;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorAnalyzeConfig {

    @Profile({"dev", "prod"})
    @Configuration
    @RequiredArgsConstructor
    @EnableConfigurationProperties({LlmProperties.class, ErrorAnalyzeSlackProperties.class})
    public static class ErrorAnalyzeSlackConfig {

        private final LlmProperties llmProperties;
        private final ErrorAnalyzeSlackProperties slackProperties;

        @Bean
        public ErrorAnalyzer flowiseAnalyzer(
                @Qualifier("llmAnalyzerClientBuilder")
                WebClient.Builder webClientBuilder
        ) {
            return new LlmErrorAnalyzer(webClientBuilder, llmProperties);
        }

        @Bean
        public ErrorAnalyzeMessageSender errorAnalyzeMessageSender(
                @Qualifier("slackClientBuilder")
                WebClient.Builder webClientBuilder
        ) {
            return new ErrorAnalyzeSlackMessageSender(
                    webClientBuilder,
                    new SlackMessageResolver(),
                    slackProperties
            );
        }
    }

    @Profile({"test", "local"})
    @Configuration
    public static class ConsoleAnalyzeConfig {

        @Bean
        public ErrorAnalyzer consoleAnalyzer() {
            return new ConsoleErrorAnalyzer();
        }

        @Bean
        public ErrorAnalyzeMessageSender consoleMessageSender() {
            return new ConsoleAnalyzeMessageSender();
        }
    }
}

