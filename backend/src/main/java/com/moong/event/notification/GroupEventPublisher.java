package com.moong.event.notification;

import com.moong.domain.notification.Notification;
import com.moong.event.group.GroupEventMessage;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.payload.GroupEventPayload;
import com.moong.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GroupEventPublisher {

    private final GroupEventChannelSender groupEventChannelSender;
    private final NotificationService notificationService;

    @Async("groupEventPublisherExecutor")
    public void publishAsync(GroupEventMessage<? extends GroupEventPayload> message) {
        Notification notification = notificationService.createNotification(message);
        GroupEvent<GroupEventPayload> event = new GroupEvent<>(
                message.eventType(),
                message.groupId(),
                notification.getId(),
                message.senderId(),
                message.data()
        );
        groupEventChannelSender.send(event);
    }
}
