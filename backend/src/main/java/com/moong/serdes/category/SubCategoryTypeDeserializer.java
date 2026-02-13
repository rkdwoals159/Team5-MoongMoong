package com.moong.serdes.category;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.moong.domain.enums.SubCategoryType;
import java.io.IOException;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class SubCategoryTypeDeserializer extends JsonDeserializer<SubCategoryType> {

    @Override
    public SubCategoryType deserialize(
            JsonParser jsonParser,
           DeserializationContext deserializationContext
    ) throws IOException {
        String text = jsonParser.getValueAsString();
        return SubCategoryType.fromDescription(text);
    }

    @Override
    public SubCategoryType getNullValue(DeserializationContext ctxt) {
        return null;
    }
}
