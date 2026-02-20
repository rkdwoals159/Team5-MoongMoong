package com.moong.serdes.medicaladvice;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.moong.domain.medicaladvice.TreatmentAvgCost;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class TreatmentAvgCostSerializer extends JsonSerializer<TreatmentAvgCost> {

    @Override
    public void serialize(TreatmentAvgCost value,
                          JsonGenerator generator,
                          SerializerProvider serializers) throws IOException {
        generator.writeStartObject();
        generator.writeStringField("treatment", value.treatmentName());
        generator.writeNumberField("cost", value.averageCost());
        generator.writeEndObject();
    }
}
