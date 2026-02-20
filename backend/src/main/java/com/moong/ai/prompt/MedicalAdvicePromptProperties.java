package com.moong.ai.prompt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "medical-advice")
public record MedicalAdvicePromptProperties(
        String promptTemplate,
        String systemPrompt,
        String formatMessage
) {

}
