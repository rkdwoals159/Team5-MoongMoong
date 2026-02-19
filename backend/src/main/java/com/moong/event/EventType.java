package com.moong.event;

import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.group.GroupEventPayload;

public enum EventType {
    SAVING(CoinCreatedPayload.class);

    private final Class<? extends GroupEventPayload> payloadClass;

    EventType(Class<? extends GroupEventPayload> payloadClass) {
        this.payloadClass = payloadClass;
    }

    public Class<? extends GroupEventPayload> payloadClass() {
        return payloadClass;
    }
}
