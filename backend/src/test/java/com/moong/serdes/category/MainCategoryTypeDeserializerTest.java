package com.moong.serdes.category;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.moong.domain.enums.MainCategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class MainCategoryTypeDeserializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("정상 값이면 해당 enum으로 역직렬화된다")
    @Test
    void deserialize_valid_value() throws Exception {
        String content = "{\"mainCategory\":\"사료/간식\"}";

        TestDto result = json.parseObject(content);

        assertThat(result.mainCategory())
                .isEqualTo(MainCategoryType.FOOD_AND_TREATS);
    }

    @DisplayName("null이면 OTHER로 역직렬화된다")
    @Test
    void deserialize_null_value() throws Exception {
        String content = "{\"mainCategory\":null}";

        TestDto result = json.parseObject(content);

        assertThat(result.mainCategory())
                .isEqualTo(MainCategoryType.OTHER);
    }

    record TestDto(MainCategoryType mainCategory) {
    }
}
