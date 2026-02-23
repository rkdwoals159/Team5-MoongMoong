package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Notification;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.notification.NotificationCountResponse;
import com.moong.event.EventType;
import com.moong.event.dto.NudgePayload;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
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
        notificationCursorGenerator.generateNotificationCursor(crew, oldLastSeenId);
        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);

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
        notificationCursorGenerator.generateNotificationCursor(crew, oldLastSeenId);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        crewNotificationGenerator.generateSaved(crew, notification);

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

    @DisplayName("해당 크루의 읽지 않은 알림 개수 반환 성공")
    @Test
    void countNotification() {
        Member member = memberGenerator.generateSaved("test");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
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

        NotificationCountResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .when()
                .get("/api/notifications/count")
                .then()
                .log().all()
                .statusCode(200)
                .extract()
                .as(NotificationCountResponse.class);

        assertThat(response.count()).isEqualTo(expectedCount);
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
        notificationCursorGenerator.generateNotificationCursor(crew, oldLastSeenId);

        NudgePayload nudgePayload = new NudgePayload("test");
        Notification notification1 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification2 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification3 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);
        Notification notification4 = notificationGenerator.generateSaved(nudgePayload, EventType.NUDGE);

        crewNotificationGenerator.generateSaved(crew, notification1);
        crewNotificationGenerator.generateSaved(crew, notification2);
        crewNotificationGenerator.generateSaved(crew, notification3);
        crewNotificationGenerator.generateSaved(crew, notification4);


        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .when()
                .delete("/api/notifications")
                .then()
                .log().all()
                .statusCode(200);
    }
}
