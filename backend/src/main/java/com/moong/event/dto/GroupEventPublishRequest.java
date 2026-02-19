package com.moong.event.dto;

import com.moong.event.group.GroupEventPayload;
import com.moong.event.EventType;

public record GroupEventPublishRequest<T extends GroupEventPayload>(
        EventType eventType,
        long groupId,
        long senderId,
        T data
) {}
