package com.moong.event.group;

import com.moong.event.group.payload.AiAdviceCreatedPayload;
import com.moong.event.group.payload.CoinCreatedPayload;
import com.moong.event.group.payload.NudgePayload;
import com.moong.event.group.payload.GroupEventPayload;

public enum EventType {

    SAVING(CoinCreatedPayload.class, false),
    NUDGE(NudgePayload.class, false),
    AI_ADVICE_CREATED(AiAdviceCreatedPayload.class, true);

    private final Class<? extends GroupEventPayload> payloadClass;
    private final boolean includeSender;

    EventType(Class<? extends GroupEventPayload> payloadClass, boolean includeSender) {
        this.payloadClass = payloadClass;
        this.includeSender = includeSender;
    }

    public Class<? extends GroupEventPayload> payloadClass() {
        return payloadClass;
    }

    public boolean includeSender() {
        return includeSender;
    }
}
