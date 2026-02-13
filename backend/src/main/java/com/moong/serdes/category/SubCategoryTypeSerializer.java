package com.moong.serdes.category;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.moong.domain.enums.SubCategoryType;
import java.io.IOException;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class SubCategoryTypeSerializer extends JsonSerializer<SubCategoryType> {

    @Override
    public void serialize(
            SubCategoryType value,
            JsonGenerator jsonGenerator,
            SerializerProvider serializers
    ) throws IOException {
        if (value == null) {
            jsonGenerator.writeNull();
            return;
        }
        jsonGenerator.writeString(value.getDescription());
    }
}
