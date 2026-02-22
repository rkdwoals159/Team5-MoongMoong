package com.moong.event.dto;

import com.moong.event.group.GroupEventPayload;

public record NudgePayload(
        String memberName
) implements GroupEventPayload {
}
