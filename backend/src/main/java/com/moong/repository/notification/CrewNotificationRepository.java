package com.moong.repository.notification;

import com.moong.domain.entity.CrewNotification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface CrewNotificationRepository extends Repository<CrewNotification, Long> {

    CrewNotification save(CrewNotification crewNotification);

    @Query("""
        select cn
        from CrewNotification cn
        join fetch cn.notification n
        where cn.deletedAt is null
          and cn.crew.id = :crewId
    """)
    Slice<CrewNotification> findFetchedByCrewId(long crewId, Pageable page);
}
