package com.moong.serdes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class YearMonthDeserializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("문자열 형식 (yyyy-MM)을 YearMonth로 변환")
    @Test
    void deserializeFromString() throws Exception {
        String content = "{\"birthDate\":\"2025-02\"}";

        TestDto result = json.parseObject(content);

        assertThat(result.birthDate()).isEqualTo(YearMonth.of(2025, 2));
    }

    @DisplayName("배열 형식 [year, month]를 YearMonth로 변환")
    @Test
    void deserializeFromArray() throws Exception {
        String content = "{\"birthDate\":[2025, 2]}";

        TestDto result = json.parseObject(content);

        assertThat(result.birthDate()).isEqualTo(YearMonth.of(2025, 2));
    }

    @DisplayName("객체 형식 {year, month}를 YearMonth로 변환")
    @Test
    void deserializeFromObject() throws Exception {
        String content = "{\"birthDate\":{\"year\":2025,\"month\":2}}";

        TestDto result = json.parseObject(content);

        assertThat(result.birthDate()).isEqualTo(YearMonth.of(2025, 2));
    }

    @DisplayName("잘못된 형식은 예외를 발생시킨다.")
    @Test
    void deserializeInvalidFormat() {
        String content = "{\"birthDate\":\"2025/02\"}";

        assertThatThrownBy(() -> json.parseObject(content))
                .hasCauseInstanceOf(DateTimeParseException.class);
    }

    record TestDto(YearMonth birthDate) {
    }
}
