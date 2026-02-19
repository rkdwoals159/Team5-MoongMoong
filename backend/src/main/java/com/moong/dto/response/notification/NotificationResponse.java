package com.moong.dto.response.notification;

import com.moong.domain.entity.CrewNotification;
import com.moong.event.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "사용자에게 표시되는 개별 알림 정보")
public record NotificationResponse(

        @Schema(description = "알림 ID", example = "1")
        long notificationId,

        @Schema(description = "알림 내용")
        String content,

        @Schema(description = "이벤트 종류", example = "SAVING")
        EventType eventType,

        @Schema(description = "생성 시간", example = "2026-01-30T14:32:15.123+09:00")
        LocalDateTime createdAt
) {

    public NotificationResponse(CrewNotification crewNotification) {
        this(
                crewNotification.getNotification().getId(),
                crewNotification.getNotification().getContent(),
                crewNotification.getNotification().getEventType(),
                crewNotification.getNotification().getCreatedAt()
        );
    }
}

