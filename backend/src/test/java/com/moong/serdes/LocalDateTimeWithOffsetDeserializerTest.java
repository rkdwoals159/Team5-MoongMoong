package com.moong.serdes;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.moong.serdes.time.LocalDateTimeWithOffsetDeserializer;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import static org.assertj.core.api.Assertions.assertThat;

class LocalDateTimeWithOffsetDeserializerTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    void offset_plus09_is_same_local_time_in_seoul() throws Exception {
        String json = """
                {"time":"2026-02-16T10:20:30+09:00"}
                """;

        TestDto dto = objectMapper.readValue(json, TestDto.class);

        assertThat(dto.time()).isEqualTo(LocalDateTime.of(2026, 2, 16, 10, 20, 30));
    }

    @Test
    void offset_utc_is_converted_to_seoul_time_plus9_hours() throws Exception {
        String json = """
                {"time":"2026-02-16T10:20:30+00:00"}
                """;

        TestDto dto = objectMapper.readValue(json, TestDto.class);

        assertThat(dto.time()).isEqualTo(LocalDateTime.of(2026, 2, 16, 19, 20, 30));
    }

    @Test
    void offset_minus05_is_converted_to_seoul_time() throws Exception {
        String json = """
                {"time":"2026-02-16T10:20:30-05:00"}
                """;
        TestDto dto = objectMapper.readValue(json, TestDto.class);

        assertThat(dto.time()).isEqualTo(LocalDateTime.of(2026, 2, 17, 0, 20, 30));
    }

    @Test
    void no_offset_string_is_parsed_as_is() throws Exception {
        String json = """
                {"time":"2026-02-16T10:20:30"}
                """;

        TestDto dto = objectMapper.readValue(json, TestDto.class);

        assertThat(dto.time()).isEqualTo(LocalDateTime.of(2026, 2, 16, 10, 20, 30));
    }

    @Test
    void blank_string_returns_null() throws Exception {
        String json = """
                {"time":"   "}
                """;

        TestDto dto = objectMapper.readValue(json, TestDto.class);

        assertThat(dto.time()).isNull();
    }

    record TestDto(
            @JsonDeserialize(using = LocalDateTimeWithOffsetDeserializer.class)
            LocalDateTime time
    ) {}
}



