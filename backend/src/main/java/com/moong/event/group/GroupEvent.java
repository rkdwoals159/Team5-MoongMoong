package com.moong.event.group;

public record GroupEvent<T>(
        EventType eventType,
        long groupId,
        long eventId,
        long senderId,
        T data
) {
}
