package com.moong.event;

import com.moong.event.dto.AiAdviceCreatedPayload;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.dto.NudgePayload;
import com.moong.event.group.GroupEventPayload;

public enum EventType {

    SAVING(CoinCreatedPayload.class),
    NUDGE(NudgePayload.class),
    AI_ADVICE_CREATED(AiAdviceCreatedPayload.class);

    private final Class<? extends GroupEventPayload> payloadClass;

    EventType(Class<? extends GroupEventPayload> payloadClass) {
        this.payloadClass = payloadClass;
    }

    public Class<? extends GroupEventPayload> payloadClass() {
        return payloadClass;
    }
}
