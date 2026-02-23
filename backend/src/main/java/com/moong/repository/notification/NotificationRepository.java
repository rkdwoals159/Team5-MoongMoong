package com.moong.repository.notification;

import com.moong.domain.notification.Notification;
import org.springframework.data.repository.Repository;

public interface NotificationRepository extends Repository<Notification, Long> {

    Notification save(Notification notification);

    long count();
}
