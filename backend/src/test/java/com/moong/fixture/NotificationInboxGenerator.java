package com.moong.fixture;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.NotificationCursor;
import com.moong.repository.notification.NotificationCursorRepository;
import org.springframework.stereotype.Component;

@Component
public class NotificationInboxGenerator {

    private final NotificationCursorRepository notificationCursorRepository;

    public NotificationInboxGenerator(NotificationCursorRepository notificationCursorRepository) {
        this.notificationCursorRepository = notificationCursorRepository;
    }

    public NotificationCursor generateNotificationInbox(Crew crew, Long lastSeenNotificationId) {
        NotificationCursor notificationCursor = new NotificationCursor(null, crew, lastSeenNotificationId);
        return notificationCursorRepository.save(notificationCursor);
    }
}
