package com.moong.event.dto;

import com.moong.event.group.GroupEventPayload;
import com.moong.event.group.GroupEventType;

public record GroupEventPublishRequest<T extends GroupEventPayload>(
        GroupEventType eventType,
        long groupId,
        long senderId,
        T data
) {}
