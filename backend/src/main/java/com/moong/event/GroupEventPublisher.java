package com.moong.event;

import com.moong.domain.entity.Notification;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.event.transport.GroupEventChannelSender;
import com.moong.service.NotificationService;
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
