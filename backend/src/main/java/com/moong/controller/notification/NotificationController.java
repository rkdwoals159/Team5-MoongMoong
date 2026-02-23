package com.moong.controller.notification;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.NotificationControllerSwagger;
import com.moong.domain.member.Member;
import com.moong.dto.command.NotificationReadCommand;
import com.moong.dto.response.notification.NotificationCountResponse;
import com.moong.dto.response.notification.NotificationReadResponse;
import com.moong.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NotificationController implements NotificationControllerSwagger {

    private final NotificationService notificationService;

    @Override
    @GetMapping("/api/notifications")
    public ResponseEntity<NotificationReadResponse> findNotification(
            @AuthMember Member member,
            Pageable pageable
    ) {
        NotificationReadCommand notificationReadCommand = new NotificationReadCommand(member, pageable);
        NotificationReadResponse response =
                notificationService.findNotification(notificationReadCommand);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/api/notifications/count")
    public ResponseEntity<NotificationCountResponse> countNotification(
            @AuthMember Member member
    ) {
        NotificationCountResponse response = notificationService.countNotification(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @DeleteMapping("/api/notifications/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @AuthMember Member member,
            @PathVariable long notificationId
    ) {
        notificationService.deleteNotification(member, notificationId);
        return ResponseEntity.ok().build();
    }

    @Override
    @DeleteMapping("/api/notifications")
    public ResponseEntity<Void> deleteNotification(
            @AuthMember Member member
    ) {
        notificationService.deleteNotifications(member);
        return ResponseEntity.ok().build();
    }
}
