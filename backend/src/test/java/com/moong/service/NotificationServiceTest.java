package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.CrewNotification;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Notification;
import com.moong.domain.entity.NotificationCursor;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.command.NotificationReadCommand;
import com.moong.dto.request.notification.NotificationsDeleteRequest;
import com.moong.dto.response.notification.NotificationReadResponse;
import com.moong.dto.response.notification.NotificationResponse;
import com.moong.event.EventType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.notification.CrewNotificationRepository;
import com.moong.repository.notification.NotificationCursorRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

class NotificationServiceTest extends BaseServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationCursorRepository notificationCursorRepository;

    @Autowired
    private CrewNotificationRepository crewNotificationRepository;

    @DisplayName("조회 결과가 비어있으면 empty 응답을 반환하고 lastSeen은 갱신되지 않는다")
    @Test
    void emptySlice_returnsEmptyResponse_and_doesNotUpdateLastSeen() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);

        notificationInboxGenerator.generateNotificationInbox(crew, null);

        Pageable pageable = PageRequest.of(0, 3);
        NotificationReadCommand command = new NotificationReadCommand(member, pageable);

        NotificationReadResponse response = notificationService.findNotification(command);

        NotificationCursor updatedNotificationCursor =
                notificationCursorRepository.getByCrew_Id(crew.getId());

        assertAll(
                () -> assertThat(response.lastSeenNotificationId()).isNull(),
                () -> assertThat(response.notifications()).isEmpty(),
                () -> assertThat(response.hasNext()).isFalse(),
                () -> assertThat(response.page()).isEqualTo(0),
                () -> assertThat(updatedNotificationCursor.getLastSeenNotificationId()).isNull()
        );
    }

    @DisplayName("lastSeen이 null인 상태에서 첫 페이지 조회 시 응답은 null을 반환하고 DB는 최신 id로 갱신된다")
    @Test
    void firstPage_whenLastSeenIsNull_updatesDbAndResponseReturnsNull() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        notificationInboxGenerator.generateNotificationInbox(crew, null);
        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        Notification notification2 = notificationGenerator.generateSaved("알림2", EventType.SAVING);
        Notification notification3 = notificationGenerator.generateSaved("알림3", EventType.SAVING);
        Notification notification4 = notificationGenerator.generateSaved("알림4", EventType.SAVING);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        Pageable pageable = PageRequest.of(0, 3);
        NotificationReadCommand command = new NotificationReadCommand(member, pageable);

        NotificationReadResponse response = notificationService.findNotification(command);

        NotificationCursor updatedNotificationCursor = notificationCursorRepository.getByCrew_Id(crew.getId());

        assertAll(
                () -> assertThat(response.lastSeenNotificationId()).isNull(),
                () -> assertThat(response.hasNext()).isTrue(),
                () -> assertThat(response.page()).isEqualTo(pageable.getPageNumber()),
                () -> assertThat(response.notifications())
                        .extracting(NotificationResponse::notificationId)
                        .containsExactly(
                                notification4.getId(),
                                notification3.getId(),
                                notification2.getId()
                        ),
                () -> assertThat(updatedNotificationCursor.getLastSeenNotificationId()).isEqualTo(notification4.getId())
        );
    }

    @DisplayName("page 조회 시 slice 최신 id가 lastSeen보다 크면 lastSeen이 갱신된다")
    @Test
    void pageRead_whenSliceNewestIsGreater_advancesLastSeen() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);

        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        Notification notification2 = notificationGenerator.generateSaved("알림2", EventType.SAVING);
        Notification notification3 = notificationGenerator.generateSaved("알림3", EventType.SAVING);
        Notification notification4 = notificationGenerator.generateSaved("알림4", EventType.SAVING);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        notificationInboxGenerator.generateNotificationInbox(crew, notification1.getId());

        Pageable pageable = PageRequest.of(1, 2);
        NotificationReadCommand command = new NotificationReadCommand(member, pageable);

        NotificationReadResponse response = notificationService.findNotification(command);

        NotificationCursor updatedInbox = notificationCursorRepository.getByCrew_Id(crew.getId());
        assertAll(
                () -> assertThat(response.page()).isEqualTo(1),
                () -> assertThat(response.lastSeenNotificationId()).isEqualTo(notification1.getId()),
                () -> assertThat(updatedInbox.getLastSeenNotificationId()).isEqualTo(notification2.getId())
        );
    }

    @DisplayName("page 조회 시 slice 최신 id가 lastSeen보다 크면 lastSeen이 갱신된다")
    @Test
    void secondPage_updatesLastSeenToSliceNewest() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        notificationInboxGenerator.generateNotificationInbox(crew, null);

        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        Notification notification2 = notificationGenerator.generateSaved("알림2", EventType.SAVING);
        Notification notification3 = notificationGenerator.generateSaved("알림3", EventType.SAVING);
        Notification notification4 = notificationGenerator.generateSaved("알림4", EventType.SAVING);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        Pageable pageable = PageRequest.of(1, 2);
        NotificationReadCommand command = new NotificationReadCommand(member, pageable);

        NotificationReadResponse response = notificationService.findNotification(command);

        NotificationCursor updatedInbox = notificationCursorRepository.getByCrew_Id(crew.getId());

        // page=1,size=2,desc: page0=[n4,n3], page1=[n2,n1] => slice newest = n2
        assertAll(
                () -> assertThat(response.page()).isEqualTo(1),
                () -> assertThat(response.notifications())
                        .extracting(NotificationResponse::notificationId)
                        .containsExactly(
                                notification2.getId(),
                                notification1.getId()
                        ),
                () -> assertThat(updatedInbox.getLastSeenNotificationId()).isEqualTo(notification2.getId())
        );
    }

    @DisplayName("알림 단건 삭제 성공")
    @Test
    void deleteNotificationSuccess() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        notificationInboxGenerator.generateNotificationInbox(crew, null);

        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);

        Pageable pageable = PageRequest.of(1, 2);
        NotificationReadCommand command = new NotificationReadCommand(member, pageable);

        notificationService.deleteNotification(member, notification1.getId());

        Optional<CrewNotification> crewNotification = crewNotificationRepository
                .findByCrewIdAndNotificationId(crew.getId(), notification1.getId());
        assertThat(crewNotification).isEmpty();

    }

    @DisplayName("해당 멤버의 알림이 아니면 삭제에 실패한다")
    @Test
    void deleteNotificationFailure() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        Notification notification = notificationGenerator.generateSaved("알림1", EventType.SAVING);

        assertThatThrownBy(
                () -> notificationService.deleteNotification(member, notification.getId())
        )
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.CREW_NOTIFICATION_NOT_FOUND.getMessage());
    }

    @DisplayName("알림 다중 삭제 성공")
    @Test
    void deleteNotifications() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        notificationInboxGenerator.generateNotificationInbox(crew, null);

        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        Notification notification2 = notificationGenerator.generateSaved("알림2", EventType.SAVING);
        Notification notification3 = notificationGenerator.generateSaved("알림3", EventType.SAVING);
        Notification notification4 = notificationGenerator.generateSaved("알림4", EventType.SAVING);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        NotificationsDeleteRequest request = new NotificationsDeleteRequest(
                List.of(
                        notification1.getId(),
                        notification2.getId(),
                        notification3.getId(),
                        notification4.getId()
                )
        );

        notificationService.deleteNotifications(member, request);

        Pageable pageable = PageRequest.of(0, 1);
        Slice<CrewNotification> deletedCrewNotification = crewNotificationRepository.findFetchedByCrewId(crew.getId(),
                pageable);
        assertThat(deletedCrewNotification.getContent()).hasSize(0);
    }
}
