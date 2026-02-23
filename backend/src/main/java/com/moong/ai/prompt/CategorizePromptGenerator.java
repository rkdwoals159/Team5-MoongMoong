package com.moong.ai.prompt;

import com.moong.config.ai.CategorizePromptProperties;
import java.util.StringJoiner;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(CategorizePromptProperties.class)
public class CategorizePromptGenerator {

    private static final String SYSTEM_PROMPT_PREFIX = "System Prompt: ";
    private static final String USER_PROMPT_PREFIX = "User Prompt: ";
    private static final String FORMAT_REQUEST_PREFIX = "Output Format Request: ";
    private static final String USER_PROMPT_IDENTIFIER = "{input}";

    private final CategorizePromptProperties properties;

    public String generate(String userInput) {
        StringJoiner joiner = new StringJoiner(System.lineSeparator());
        joiner.add(SYSTEM_PROMPT_PREFIX);
        joiner.add(properties.systemPrompt());
        joiner.add(USER_PROMPT_PREFIX);
        joiner.add(buildCategoryUserPrompt(userInput));
        joiner.add(FORMAT_REQUEST_PREFIX);
        joiner.add(properties.formatMessage());
        return joiner.toString();
    }

    private String buildCategoryUserPrompt(String input) {
        return properties.promptTemplate()
                .replace(USER_PROMPT_IDENTIFIER, input);
    }
}
