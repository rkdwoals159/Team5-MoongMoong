package com.moong.serdes;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

public class LocalDateTimeWithOffsetDeserializer extends JsonDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(
            JsonParser jsonParser,
            DeserializationContext deserializationContext
    ) throws IOException {
        String value = jsonParser.getText();
        if (value == null || value.isBlank()) return null;

        try {
            OffsetDateTime offsetDateTime = OffsetDateTime.parse(value);
            ZoneId serverZone = ZoneId.systemDefault();
            return offsetDateTime
                    .atZoneSameInstant(serverZone)
                    .toLocalDateTime();

        } catch (Exception ignored) {
        }

        return LocalDateTime.parse(value);
    }
}
