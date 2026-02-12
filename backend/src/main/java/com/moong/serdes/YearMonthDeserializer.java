package com.moong.serdes;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.io.IOException;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class YearMonthDeserializer extends JsonDeserializer<YearMonth> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    @Override
    public YearMonth deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonToken token = p.currentToken();

        if (token == JsonToken.VALUE_STRING) {
            String value = p.getText();
            if (value == null || value.isEmpty()) {
                return null;
            }
            return YearMonth.parse(value, FORMATTER);
        }

        if (token == JsonToken.START_OBJECT || token == JsonToken.START_ARRAY) {
            JsonNode node = p.getCodec().readTree(p);

            //배열 형식: [2025, 1]
            if (node.isArray()) {
                int year = node.get(0).asInt();
                int month = node.get(1).asInt();
                return YearMonth.of(year, month);
            }

            //객체 형식 {"year" : 2025, "month" : 3}
            int year = node.get("year").asInt();
            int month = node.get("month").asInt();
            return YearMonth.of(year, month);
        }
        throw new BusinessException(ErrorCode.FIELD_ERROR);
    }
}
