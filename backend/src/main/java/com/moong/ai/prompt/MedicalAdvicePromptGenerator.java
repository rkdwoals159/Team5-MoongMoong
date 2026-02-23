package com.moong.ai.prompt;

import com.moong.config.ai.MedicalAdvicePromptProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(MedicalAdvicePromptProperties.class)
public class MedicalAdvicePromptGenerator {

    private static final String SYSTEM_PROMPT_PREFIX = "System Prompt: ";
    private static final String USER_PROMPT_PREFIX = "User Prompt: ";
    private static final String FORMAT_REQUEST_PREFIX = "Output Format Request: ";

    private static final String DISEASE_PLACEHOLDER = "{disease}";
    private static final String RATIO_PLACEHOLDER = "{ratio}";
    private static final String TREATMENTS_PLACEHOLDER = "{treatments}";
    private static final String AVG_MEDICAL_EXPENSE_PLACEHOLDER = "{avgMedicalExpense}";

    private final MedicalAdvicePromptProperties properties;

    public String generate(String disease, int ratio, String treatmentsJson, long avgMedicalExpense) {
        StringJoiner joiner = new StringJoiner(System.lineSeparator());
        joiner.add(SYSTEM_PROMPT_PREFIX);
        joiner.add(properties.systemPrompt());

        joiner.add(USER_PROMPT_PREFIX);
        joiner.add(buildMedicalAdviceInputPrompt(disease, ratio, treatmentsJson, avgMedicalExpense));

        joiner.add(FORMAT_REQUEST_PREFIX);
        joiner.add(properties.formatMessage());

        return joiner.toString();
    }

    private String buildMedicalAdviceInputPrompt(String disease, int ratio, String treatmentsJson, long avgMedicalExpense) {
        return properties.promptTemplate()
                .replace(DISEASE_PLACEHOLDER, disease)
                .replace(RATIO_PLACEHOLDER, String.valueOf(ratio))
                .replace(TREATMENTS_PLACEHOLDER, treatmentsJson)
                .replace(AVG_MEDICAL_EXPENSE_PLACEHOLDER, String.valueOf(avgMedicalExpense));
    }
}
