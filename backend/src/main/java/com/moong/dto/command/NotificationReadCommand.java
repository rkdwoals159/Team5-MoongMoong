package com.moong.dto.command;

import com.moong.domain.notification.CrewNotification;
import com.moong.domain.member.Member;
import com.moong.domain.notification.Notification;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
public class NotificationReadCommand {

    private static final Sort DEFAULT_SORTING_RULE = Sort.by(
            Sort.Order.desc(String.format("%s.%s",
                            CrewNotification.NOTIFICATION_FILED_NAME,
                            Notification.COLUMN_ID
                    )
            )
    );

    private final Member member;
    private final Pageable pageable;

    public NotificationReadCommand(Member member, Pageable pageable) {
        this.member = member;
        this.pageable = makePageableWithDefaultSort(pageable);
    }

    private Pageable makePageableWithDefaultSort(Pageable pageable) {
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                DEFAULT_SORTING_RULE
        );
    }
}
