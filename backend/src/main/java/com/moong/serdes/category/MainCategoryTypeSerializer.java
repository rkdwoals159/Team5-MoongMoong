package com.moong.serdes.category;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.moong.domain.enums.MainCategoryType;
import java.io.IOException;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class MainCategoryTypeSerializer extends JsonSerializer<MainCategoryType> {

    @Override
    public void serialize(
            MainCategoryType value,
            JsonGenerator jsonGenerator,
            SerializerProvider serializers
    ) throws IOException {
        if (value == null) {
            jsonGenerator.writeString(MainCategoryType.OTHER.getDescription());
            return;
        }
        jsonGenerator.writeString(value.getDescription());
    }
}

