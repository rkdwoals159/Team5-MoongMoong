package com.moong.event.group;

public record GroupEvent<T>(
        GroupEventType eventType,
        long groupId,
        long eventId,
        long senderId,
        T data
) {
}
