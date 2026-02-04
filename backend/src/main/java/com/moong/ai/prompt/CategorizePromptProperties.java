package com.moong.ai.prompt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "category-classification")
public record CategorizePromptProperties(
        String promptTemplate,
        String systemPrompt,
        String formatMessage
) {

}
