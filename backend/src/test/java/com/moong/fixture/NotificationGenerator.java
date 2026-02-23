package com.moong.fixture;

import com.moong.domain.notification.Notification;
import com.moong.event.group.EventType;
import com.moong.event.group.payload.GroupEventPayload;
import com.moong.repository.notification.NotificationRepository;
import com.moong.serdes.groupevent.GroupEventPayloadConverter;
import org.springframework.stereotype.Component;

@Component
public class NotificationGenerator {

    private final NotificationRepository notificationRepository;
    private final GroupEventPayloadConverter groupEventPayloadConverter;

    public NotificationGenerator(NotificationRepository notificationRepository, GroupEventPayloadConverter groupEventPayloadConverter) {
        this.notificationRepository = notificationRepository;
        this.groupEventPayloadConverter = groupEventPayloadConverter;
    }

    public Notification generateSaved(GroupEventPayload groupEventPayload, EventType eventType) {
        String payloadJson = groupEventPayloadConverter.toJson(groupEventPayload);
        Notification notification = new Notification(null, payloadJson, eventType);
        return notificationRepository.save(notification);
    }
}
