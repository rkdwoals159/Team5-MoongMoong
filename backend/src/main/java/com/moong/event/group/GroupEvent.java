package com.moong.event.group;

import com.moong.event.EventType;

public record GroupEvent<T>(
        EventType eventType,
        long groupId,
        long eventId,
        long senderId,
        T data
) {
}
