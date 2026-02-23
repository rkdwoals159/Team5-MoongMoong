package com.moong.dto.response.notification;

import com.moong.event.group.EventType;
import com.moong.event.group.payload.GroupEventPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "사용자에게 표시되는 개별 알림 정보")
public record NotificationResponse(

        @Schema(description = "알림 ID", example = "1")
        long notificationId,

        @Schema(description = "알림 내용")
        GroupEventPayload payload,

        @Schema(description = "이벤트 종류", example = "SAVING")
        EventType eventType,

        @Schema(description = "생성 시간", example = "2026-01-30T14:32:15.123+09:00")
        LocalDateTime createdAt
) {
}
