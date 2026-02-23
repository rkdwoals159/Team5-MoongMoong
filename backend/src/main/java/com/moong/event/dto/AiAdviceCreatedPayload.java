package com.moong.event.dto;

import com.moong.event.group.GroupEventPayload;

public record AiAdviceCreatedPayload(
        String message
) implements GroupEventPayload {

    private static final String ADVICE_CREATED_MESSAGE = "AI 의사 권장사항 생성이 완료되었습니다!";

    AiAdviceCreatedPayload() {
        this(ADVICE_CREATED_MESSAGE);
    }
}
