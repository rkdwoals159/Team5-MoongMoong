package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.moong.domain.crew.Crew;
import com.moong.domain.notification.CrewNotification;
import com.moong.domain.member.Member;
import com.moong.domain.notification.Notification;
import com.moong.domain.notification.NotificationCursor;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.command.NotificationReadCommand;
import com.moong.dto.response.notification.NotificationCountResponse;
import com.moong.dto.response.notification.NotificationReadResponse;
import com.moong.dto.response.notification.NotificationResponse;
import com.moong.event.group.EventType;
import com.moong.event.group.GroupEventMessage;
import com.moong.event.group.payload.NudgePayload;
import com.moong.repository.notification.CrewNotificationRepository;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.notification.NotificationCursorRepository;
import com.moong.repository.notification.NotificationRepository;
import com.moong.service.notification.NotificationService;
import java.time.LocalDateTime;
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

    @Autowired
    private NotificationRepository notificationRepository;

    @DisplayName("알림을 저장하고, 알림을 발생시킨 크루를 제외한 크루원에게 CrewNotification을 생성한다.")
    @Test
    void createNotification() throws JsonProcessingException {
        Member member1 = memberGenerator.generateSaved("test");
        Member member2 = memberGenerator.generateSaved("test");
        Member member3 = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew1 = crewGenerator.generateSaved(petGroup, member1);
        Crew crew2 = crewGenerator.generateSaved(petGroup, member2);
        Crew crew3 = crewGenerator.generateSaved(petGroup, member3);
        NudgePayload nudgePayload = new NudgePayload(member1.getName());
        GroupEventMessage<NudgePayload> groupEventMessage = new GroupEventMessage<>(
                EventType.NUDGE,
                petGroup.getId(),
                member1.getId(),
                nudgePayload,
                EventType.NUDGE.includeSender()
        );
        notificationService.createNotification(groupEventMessage);

        Pageable pageable = PageRequest.of(0, 3);
        Slice<CrewNotification> crewNotification1 = crewNotificationRepository.findFetchedByCrewId(crew1.getId(),
                pageable);
        Slice<CrewNotification> crewNotification2 = crewNotificationRepository.findFetchedByCrewId(crew2.getId(),
                pageable);
        Slice<CrewNotification> crewNotification3 = crewNotificationRepository.findFetchedByCrewId(crew3.getId(),
                pageable);
        assertAll(
                () -> assertThat(notificationRepository.count()).isEqualTo(1),
                () -> assertThat(crewNotification1.getContent()).isEmpty(),
                () -> assertThat(crewNotification2.getContent()).hasSize(1),
                () -> assertThat(crewNotification3.getContent()).hasSize(1)
        );
    }

    @DisplayName("조회 결과가 비어있으면 empty 응답을 반환하고 lastSeen은 갱신되지 않는다")
    @Test
    void emptySlice_returnsEmptyResponse_and_doesNotUpdateLastSeen() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);

        notificationCursorGenerator.generateNotificationCursor(crew, null);

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
        notificationCursorGenerator.generateNotificationCursor(crew, null);
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);

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
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);

        notificationCursorGenerator.generateNotificationCursor(crew, notification1.getId());

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
        notificationCursorGenerator.generateNotificationCursor(crew, null);
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);

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

    @DisplayName("해당 크루의 읽지 않은 알림 개수 조회")
    @Test
    void countNotification() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        NudgePayload nudgePayload = new NudgePayload("test");

        long expectedCount = 1L;
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        notificationCursorGenerator.generateNotificationCursor(crew, notification2.getId());
        crewNotificationGenerator.generateSavedWithDeletedAt(crew, notification1, LocalDateTime.now());
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSavedWithDeletedAt(crew, notification3, LocalDateTime.now());
        crewNotificationGenerator.generateSaved(crew, notification4);

        NotificationCountResponse response = notificationService.countNotification(member);

        assertThat(response.count()).isEqualTo(expectedCount);
    }

    @DisplayName("알림 단건 삭제 성공")
    @Test
    void deleteNotificationSuccess() {
        Member member = memberGenerator.generateSaved("test");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        notificationCursorGenerator.generateNotificationCursor(crew, null);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        crewNotificationGenerator.generateSaved(crew, notification1);

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
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

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
        notificationCursorGenerator.generateNotificationCursor(crew, null);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);

        notificationService.deleteNotifications(member);

        Pageable pageable = PageRequest.of(0, 1);
        Slice<CrewNotification> deletedCrewNotification = crewNotificationRepository.findFetchedByCrewId(crew.getId(),
                pageable);
        assertThat(deletedCrewNotification.getContent()).hasSize(0);
    }
}
