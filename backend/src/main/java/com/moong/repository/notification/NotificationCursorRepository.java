package com.moong.repository.notification;

import com.moong.domain.entity.NotificationCursor;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationCursorRepository extends Repository<NotificationCursor, Long> {

    NotificationCursor save(NotificationCursor notificationCursor);

    Optional<NotificationCursor> findByCrew_Id(long id);

    default NotificationCursor getByCrew_Id(long crewId) {
        return findByCrew_Id(crewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTIFICATION_INBOX_NOT_FOUND));
    }

    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            update NotificationCursor set lastSeenNotificationId = :updateLastSeenNotificationId
                        where crew.id = :crewId
            """)
    void updateLastSeenNotificationId(long updateLastSeenNotificationId, long crewId);

    void deleteByCrew_Id(long crewId);
}
