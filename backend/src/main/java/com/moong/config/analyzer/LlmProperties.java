package com.moong.config.analyzer;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "flowise")
public record LlmProperties(
        String baseUrl,
        String id,
        String key
) {

}
