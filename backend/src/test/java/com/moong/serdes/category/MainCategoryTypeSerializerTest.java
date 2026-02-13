package com.moong.serdes.category;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.moong.domain.enums.MainCategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class MainCategoryTypeSerializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("String 데이터의 category를 mainCategoryType으로 변환")
    @Test
    void serializeMainCategory() throws Exception {
        TestDto dto = new TestDto(MainCategoryType.MEDICAL_EXPENSES);

        String result = json.write(dto).getJson();

        assertThat(result)
                .isEqualTo("{\"mainCategory\":\"의료비\"}");
    }

    @DisplayName("null이면 기타로 변환된다")
    @Test
    void serialize_null() throws Exception {
        TestDto dto = new TestDto(null);

        String result = json.write(dto).getJson();

        assertThat(result)
                .isEqualTo("{\"mainCategory\":\"기타\"}");
    }

    record TestDto(MainCategoryType mainCategory) {
        public TestDto {
            if (mainCategory == null) mainCategory = MainCategoryType.OTHER;
        }
    }
}
