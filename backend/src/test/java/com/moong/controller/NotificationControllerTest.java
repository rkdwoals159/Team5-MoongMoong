package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Notification;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.notification.NotificationReadResponse;
import com.moong.dto.response.notification.NotificationResponse;
import com.moong.event.EventType;
import io.restassured.http.ContentType;
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

        Notification notification1 = notificationGenerator.generateSaved("알림1", EventType.SAVING);
        Notification notification2 = notificationGenerator.generateSaved("알림2", EventType.SAVING);
        Notification notification3 = notificationGenerator.generateSaved("알림3", EventType.SAVING);
        Notification notification4 = notificationGenerator.generateSaved("알림4", EventType.SAVING);

        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification1);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification2);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification3);
        crewNotificationGenerator.generateSavedDeletedNotification(crew, notification4);

        NotificationReadResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .queryParam("page", 0)
                .queryParam("size", 3)
                .when()
                .get("/api/notifications")
                .then()
                .log().all()
                .statusCode(200)
                .extract()
                .as(NotificationReadResponse.class);

        assertAll(
                () -> assertThat(response.lastSeenNotificationId()).isEqualTo(oldLastSeenId),
                () -> assertThat(response.page()).isEqualTo(0),
                () -> assertThat(response.hasNext()).isTrue(),
                () -> assertThat(response.notifications())
                        .extracting(NotificationResponse::notificationId)
                        .containsExactly(
                                notification4.getId(),
                                notification3.getId(),
                                notification2.getId()
                        )
        );
    }
}
