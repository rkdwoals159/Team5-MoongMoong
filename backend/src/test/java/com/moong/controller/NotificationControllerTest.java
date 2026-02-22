package com.moong.controller;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Notification;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.notification.NotificationsDeleteRequest;
import com.moong.event.EventType;
import com.moong.event.dto.NudgePayload;
import io.restassured.http.ContentType;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

public class NotificationControllerTest extends BaseControllerTest {

    @DisplayName("그룹 알림 목록 조회 성공 - 최신순으로 반환되고, 기존에 저장되어 있던 lastSeenId를 전달한다")
    @Test
    void getGroupNotifications_success_updatesLastSeen() {
        Member member = memberGenerator.generateSaved("test");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        long oldLastSeenId = 1L;
        notificationInboxGenerator.generateNotificationInbox(crew, oldLastSeenId);
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .queryParam("page", 0)
                .queryParam("size", 3)
                .when()
                .get("/api/notifications")
                .then()
                .log().all()
                .statusCode(200);
    }

    @DisplayName("알림 단건 삭제 성공")
    @Test
    void deleteNotification() {
        Member member = memberGenerator.generateSaved("test");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        long oldLastSeenId = 1L;
        notificationInboxGenerator.generateNotificationInbox(crew, oldLastSeenId);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .pathParam("notificationId", notification.getId())
                .when()
                .delete("/api/notifications/{notificationId}")
                .then()
                .log().all()
                .statusCode(200);
    }

    @DisplayName("알림 다중 삭제 성공")
    @Test
    void deleteNotifications() {
        Member member = memberGenerator.generateSaved("test");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        long oldLastSeenId = 1L;
        notificationInboxGenerator.generateNotificationInbox(crew, oldLastSeenId);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        NotificationsDeleteRequest request = new NotificationsDeleteRequest(
                List.of(1L, 2L, 3L, 4L));

        given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .when()
                .delete("/api/notifications")
                .then()
                .log().all()
                .statusCode(200);
    }
}
