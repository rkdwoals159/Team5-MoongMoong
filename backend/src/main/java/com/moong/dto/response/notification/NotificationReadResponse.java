package com.moong.dto.response.notification;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import org.springframework.data.domain.Slice;

@Schema(description = "알림 내역 조회 응답")
public record NotificationReadResponse(

        @Schema(description = "마지막으로 확인한 알림 ID(조회 시작 시점 기준). 알림이 없으면 null")
        Long lastSeenNotificationId,

        @Schema(description = "현재 페이지 인덱스(0부터 시작)", example = "0")
        int page,

        @Schema(description = "페이지 사이즈", example = "10")
        int size,

        @Schema(description = "다음 페이지 존재 여부", example = "true")
        boolean hasNext,

        @Schema(description = "알림 목록")
        List<NotificationResponse> notifications
) {

    public NotificationReadResponse(Long lastSeenNotificationId, Slice<NotificationResponse> notifications) {
        this(
                lastSeenNotificationId,
                notifications.getNumber(),
                notifications.getSize(),
                notifications.hasNext(),
                notifications.getContent()
        );
    }

    public static NotificationReadResponse empty(Long lastSeenNotificationId, int page, int size) {
        return new NotificationReadResponse(
                lastSeenNotificationId,
                page,
                size,
                false,
                List.of()
        );
    }
}

