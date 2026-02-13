package com.moong.serdes.category;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.moong.domain.enums.MainCategoryType;
import java.io.IOException;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class MainCategoryTypeDeserializer extends JsonDeserializer<MainCategoryType> {

    @Override
    public MainCategoryType deserialize(
            JsonParser jsonParser,
            DeserializationContext deserializationContext
    ) throws IOException {
        String text = jsonParser.getValueAsString();
        return MainCategoryType.fromDescription(text);
    }

    @Override
    public MainCategoryType getNullValue(DeserializationContext ctxt) {
        return MainCategoryType.OTHER;
    }
}

