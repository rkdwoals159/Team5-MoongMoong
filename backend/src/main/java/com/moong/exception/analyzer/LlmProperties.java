package com.moong.exception.analyzer;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ab")
public record LlmProperties(
        String id,
        String key
) {

}
