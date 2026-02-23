package com.moong.ai.prompt;

import com.moong.config.ai.MedicalAdvicePromptProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MedicalAdvicePromptGeneratorTest {

    @DisplayName("실제 예시 입력으로 프롬프트가 정상 생성된다")
    @Test
    void generate_success() {
        // given
        String systemPrompt = """
                반려동물 의료비 예측 전문가 역할 수행
                """;

        String template = """
                - 질병명: {disease}
                - 발생 확률: {ratio}%
                - 치료 항목(JSON): {treatments}
                - 평균 의료비: {avgMedicalExpense}
                """;

        MedicalAdvicePromptProperties properties =
                new MedicalAdvicePromptProperties(template, systemPrompt, "");

        MedicalAdvicePromptGenerator generator =
                new MedicalAdvicePromptGenerator(properties);

        String treatmentsJson =
                "[{\"treatment\":\"각막궤양 수술\",\"cost\":1850000}]";

        // when
        String prompt = generator.generate(
                "각막염",
                60,
                treatmentsJson,
                30000L
        );

        // then
        assertThat(prompt)
                .contains("각막염")
                .contains("60%")
                .contains(treatmentsJson)
                .contains("30000");
    }
}
