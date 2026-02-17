package com.moong.event.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.moong.event.group.GroupEventPayload;
import com.moong.serdes.LocalDateTimeWithOffsetDeserializer;
import java.time.LocalDateTime;

public record CoinCreateEventResponse(
        long coinId,
        @JsonDeserialize(using = LocalDateTimeWithOffsetDeserializer.class)
        LocalDateTime createdAt,
        long amount,
        String name
) implements GroupEventPayload {
}
