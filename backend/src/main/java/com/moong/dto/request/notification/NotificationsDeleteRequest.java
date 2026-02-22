package com.moong.dto.request.notification;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(description = "알림 다중 삭제 요청")
public record NotificationsDeleteRequest(
        @Schema(description = "알림 ID 리스트")
        @NotNull(message = "알림 ID 리스트는 null일 수 없습니다.")
        List<Long> notificationIds
) {
}
