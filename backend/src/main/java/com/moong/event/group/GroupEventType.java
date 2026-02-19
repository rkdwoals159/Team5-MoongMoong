package com.moong.event.group;

import com.moong.event.dto.CoinCreatedPayload;

public enum GroupEventType {
    SAVING(CoinCreatedPayload.class);

    private final Class<? extends GroupEventPayload> payloadClass;

    GroupEventType(Class<? extends GroupEventPayload> payloadClass) {
        this.payloadClass = payloadClass;
    }

    public Class<? extends GroupEventPayload> payloadClass() {
        return payloadClass;
    }
}
