package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.CrewNotification;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Notification;
import com.moong.domain.entity.NotificationCursor;
import com.moong.dto.command.NotificationCreateCommand;
import com.moong.dto.command.NotificationReadCommand;
import com.moong.dto.request.notification.NotificationsDeleteRequest;
import com.moong.dto.response.notification.NotificationReadResponse;
import com.moong.dto.response.notification.NotificationResponse;
import com.moong.event.group.GroupEventPayload;
import com.moong.repository.CrewRepository;
import com.moong.repository.notification.CrewNotificationRepository;
import com.moong.repository.notification.NotificationCursorRepository;
import com.moong.repository.notification.NotificationRepository;
import com.moong.convertor.GroupEventPayloadConverter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final CrewRepository crewRepository;
    private final NotificationRepository notificationRepository;
    private final CrewNotificationRepository crewNotificationRepository;
    private final NotificationCursorRepository notificationCursorRepository;
    private final GroupEventPayloadConverter groupEventPayloadConverter;

    @Transactional
    public void createCrewNotification(NotificationCreateCommand command) {
        Crew actor = command.getActor();
        Member actorMember = actor.getMember();
        List<Crew> crews = crewRepository.findAllByPetGroup_Id(command.getGroupId());

        String payloadJson = groupEventPayloadConverter.toJson(command.getPayload());
        Notification notification = new Notification(payloadJson, command.getEventType());
        Notification savedNotification = notificationRepository.save(notification);

        List<CrewNotification> crewNotifications = crews.stream()
                .filter((crew) -> !crew.isSame(actorMember.getId()))
                .map(crew -> new CrewNotification(crew, savedNotification))
                .toList();

        crewNotificationRepository.saveAll(crewNotifications);
    }

    public NotificationReadResponse findNotification(NotificationReadCommand command) {
        Crew crew = crewRepository.getByMemberId(command.getMember().getId());
        NotificationCursor notificationCursor = notificationCursorRepository.getByCrew_Id(crew.getId());
        Slice<CrewNotification> crewNotifications
                = crewNotificationRepository.findFetchedByCrewId(crew.getId(), command.getPageable());

        if (!crewNotifications.hasContent()) {
            return NotificationReadResponse.empty(
                    notificationCursor.getLastSeenNotificationId(),
                    command.getPageable().getPageNumber(),
                    command.getPageable().getPageSize()
            );
        }

        Long lastSeenNotificationId = notificationCursor.getLastSeenNotificationId();
        Long newestId = crewNotifications.getContent().get(0).getNotification().getId();

        if (notificationCursor.shouldUpdateCursor(newestId)) {
            notificationCursorRepository.updateLastSeenNotificationId(newestId, crew.getId());
        }

        Slice<NotificationResponse> notificationResponses = crewNotifications.map(this::toNotificationResponse);

        return new NotificationReadResponse(
                lastSeenNotificationId,
                notificationResponses
        );
    }

    private NotificationResponse toNotificationResponse(CrewNotification crewNotifications) {
        Notification notification = crewNotifications.getNotification();

        GroupEventPayload payload = groupEventPayloadConverter.fromJson(
                notification.getPayload(),
                notification.getEventType()
        );

        return new NotificationResponse(
                notification.getId(),
                payload,
                notification.getEventType(),
                notification.getCreatedAt()
        );
    }

    public void deleteNotification(Member member, long notificationId) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        CrewNotification crewNotification = crewNotificationRepository
                .getByCrewIdAndNotificationId(crew.getId(), notificationId);
        crewNotificationRepository.delete(crewNotification);
    }

    @Transactional
    public void deleteNotifications(Member member, NotificationsDeleteRequest request) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        crewNotificationRepository.deleteAllByCrew_IdAndNotification_IdIn(crew.getId(), request.notificationIds());
    }
}
