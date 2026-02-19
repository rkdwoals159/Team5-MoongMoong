package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode404;
import com.moong.domain.entity.Member;
import com.moong.dto.response.notification.NotificationReadResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@Tag(name = "Notification API")
public interface NotificationControllerSwagger {

    @Operation(summary = "알림을 조회합니다.",
            description = "현재 참여한 그룹에서 발생한 알림을 조회합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "알림 조회 성공",
                            content = @Content(schema = @Schema(implementation = NotificationReadResponse.class))
                    ),

            })
    @ErrorCode404(description = "알림 수신 정보를 찾을 수 없습니다.")
    ResponseEntity<NotificationReadResponse> findNotification(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @ParameterObject Pageable pageable
    );

    ResponseEntity<Void> deleteNotification(
            Member member,
            long notificationId
    );

    ResponseEntity<Void> deleteNotification(
            Member member
    );
}
