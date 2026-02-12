package com.moong.serdes;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.YearMonth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class YearMonthSerializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("YearMonth를 yyyy-MM 문자열 형식으로 변환")
    @Test
    void serializeYearMonth() throws Exception {
        TestDto dto = new TestDto(YearMonth.of(2025, 2));

        String result = json.write(dto).getJson();

        assertThat(result).isEqualTo("{\"birthDate\":\"2025-02\"}");
    }

    record TestDto(YearMonth birthDate) {
    }
}
