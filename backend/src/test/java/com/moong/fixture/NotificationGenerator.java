package com.moong.fixture;

import com.moong.domain.entity.Notification;
import com.moong.event.EventType;
import com.moong.repository.notification.NotificationRepository;
import org.springframework.stereotype.Component;

@Component
public class NotificationGenerator {

    private final NotificationRepository notificationRepository;

    public NotificationGenerator(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification generateSaved(String content, EventType eventType) {
        Notification notification = new Notification(null, content, eventType);
        return notificationRepository.save(notification);
    }
}
