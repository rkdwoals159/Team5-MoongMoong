package com.moong.event.group.payload;

public record AiAdviceCreatedPayload(
        String message
) implements GroupEventPayload {

    private static final String ADVICE_CREATED_MESSAGE = "AI 의사 권장사항 생성이 완료되었습니다!";

    public AiAdviceCreatedPayload() {
        this(ADVICE_CREATED_MESSAGE);
    }
}
