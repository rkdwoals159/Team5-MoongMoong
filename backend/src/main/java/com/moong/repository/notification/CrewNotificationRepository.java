package com.moong.repository.notification;

import com.moong.domain.entity.CrewNotification;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

public interface CrewNotificationRepository extends Repository<CrewNotification, Long> {

    CrewNotification save(CrewNotification crewNotification);

    @Query("""
        select cn
        from CrewNotification cn
        join fetch cn.notification n
        where cn.crew.id = :crewId
    """)
    Slice<CrewNotification> findFetchedByCrewId(long crewId, Pageable page);

    Optional<CrewNotification> findByCrewIdAndNotificationId(long crewId, long notificationId);

    default CrewNotification getByCrewIdAndNotificationId(long crewId, long notificationId) {
        return findByCrewIdAndNotificationId(crewId, notificationId).orElseThrow(
                () -> new BusinessException(ErrorCode.CREW_NOTIFICATION_NOT_FOUND)
        );
    }

    void delete(CrewNotification crewNotification);

    void deleteAllByCrew_IdAndNotification_IdIn(long crewId, List<Long> notificationIds);
}
