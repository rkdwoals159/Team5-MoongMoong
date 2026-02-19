package com.moong.dto.response.notification;

import com.moong.domain.entity.CrewNotification;
import com.moong.event.EventType;

public record NotificationResponse(
        long notificationId,
        String content,
        EventType eventType
) {

    public NotificationResponse(CrewNotification crewNotification) {
        this(
                crewNotification.getNotification().getId(),
                crewNotification.getNotification().getContent(),
                crewNotification.getNotification().getEventType()
        );
    }
}

