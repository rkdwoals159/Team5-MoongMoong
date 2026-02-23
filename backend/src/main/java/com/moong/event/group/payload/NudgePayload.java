package com.moong.event.group.payload;

public record NudgePayload(
        String memberName
) implements GroupEventPayload {
}
