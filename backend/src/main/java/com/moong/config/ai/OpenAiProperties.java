package com.moong.config.ai;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "openai")
public record OpenAiProperties(
        String baseUrl,
        String secretKey
) {

}
