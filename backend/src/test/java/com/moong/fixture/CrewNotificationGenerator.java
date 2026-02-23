package com.moong.fixture;

import com.moong.domain.crew.Crew;
import com.moong.domain.notification.CrewNotification;
import com.moong.domain.notification.Notification;
import com.moong.repository.notification.CrewNotificationRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class CrewNotificationGenerator {

    private final CrewNotificationRepository crewNotificationRepository;

    public CrewNotificationGenerator(CrewNotificationRepository crewNotificationRepository) {
        this.crewNotificationRepository = crewNotificationRepository;
    }

    public CrewNotification generateSavedWithDeletedAt(Crew crew, Notification notification, LocalDateTime deletedAt) {
        CrewNotification crewNotification = new CrewNotification(null, crew, notification, deletedAt);
        return crewNotificationRepository.save(crewNotification);
    }

    public CrewNotification generateSaved(Crew crew, Notification notification) {
        CrewNotification crewNotification = new CrewNotification(null, crew, notification, null);
        return crewNotificationRepository.save(crewNotification);
    }
}
