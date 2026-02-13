package com.moong.serdes.category;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.moong.domain.enums.SubCategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class SubCategoryTypeSerializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("String 데이터의 category를 subCategoryType으로 변환")
    @Test
    void serializeSubCategory() throws Exception {
        TestDto dto = new TestDto(SubCategoryType.VACCINATION);

        String result = json.write(dto).getJson();

        assertThat(result)
                .isEqualTo("{\"subCategory\":\"예방접종\"}");
    }

    @DisplayName("null이면 null이 변환된다")
    @Test
    void serialize_null() throws Exception {
        TestDto dto = new TestDto(null);

        String result = json.write(dto).getJson();

        assertThat(result)
                .isEqualTo("{\"subCategory\":null}");
    }

    record TestDto(SubCategoryType subCategory) {
    }
}
