package com.moong.event.group;

import com.moong.event.dto.CoinCreateEventResponse;

public enum GroupEventType {
    SAVING(CoinCreateEventResponse.class);

    private final Class<? extends GroupEventPayload> payloadClass;

    GroupEventType(Class<? extends GroupEventPayload> payloadClass) {
        this.payloadClass = payloadClass;
    }

    public Class<? extends GroupEventPayload> payloadClass() {
        return payloadClass;
    }
}
