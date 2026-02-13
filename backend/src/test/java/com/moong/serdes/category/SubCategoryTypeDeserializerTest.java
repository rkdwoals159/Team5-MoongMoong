package com.moong.serdes.category;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.moong.domain.enums.SubCategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

@JsonTest
class SubCategoryTypeDeserializerTest {

    @Autowired
    private JacksonTester<TestDto> json;

    @DisplayName("정상 값이면 해당 enum으로 역직렬화된다")
    @Test
    void deserialize_valid_value() throws Exception {
        String content = "{\"subCategory\":\"예방접종\"}";

        TestDto result = json.parseObject(content);

        assertThat(result.subCategory())
                .isEqualTo(SubCategoryType.VACCINATION);
    }

    @DisplayName("null이면 OTHER로 역직렬화된다")
    @Test
    void deserialize_null_value() throws Exception {
        String content = "{\"subCategory\":null}";

        TestDto result = json.parseObject(content);

        assertThat(result.subCategory()).isNull();
    }

    record TestDto(SubCategoryType subCategory) {
    }
}
