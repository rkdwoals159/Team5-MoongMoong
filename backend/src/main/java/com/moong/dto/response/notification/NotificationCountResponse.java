package com.moong.dto.response.notification;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "알림 개수 조회 응답")
public record NotificationCountResponse(
        @Schema(description = "삭제되지 않은 알림 개수")
        long count
) {
}
