package com.moong.exception.analyzer.messagesender;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "slack")
public record ErrorAnalyzeSlackProperties(
        String clientErrorWebHookUrl
) {
}
