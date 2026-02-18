package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.event.SseEventSender;
import com.moong.event.transport.CustomSseEmitter;
import com.moong.repository.EmitterRepository;
import com.moong.repository.groupConnection.GroupConnectionRepository;
import java.io.IOException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

class SseControllerTest extends BaseSseControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private EmitterRepository emitterRepository;

    @Autowired
    private GroupConnectionRepository groupConnectionRepository;

    @Autowired
    private SseEventSender sseEventSender;

    private CustomSseEmitter emitter;

    @AfterEach
    void tearDown() {
        if (emitter != null) {
            emitter.complete();
        }
    }

    @DisplayName("SSE 구독 성공: 200과 text/event-stream Content-Type을 반환한다")
    @Test
    void subscribe_success() throws IOException {
        Member member = memberGenerator.generateSaved("softeer");
        String connectionToken = jwtTokenGenerator.generateConnectionToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        webTestClient.get()
                .uri("/api/group/sse")
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + connectionToken)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM)
                .returnResult(String.class);

        emitter = emitterRepository.findById(member.getId()).get();
        assertThat(emitter).isNotNull();
    }

    @DisplayName("SSE 구독 실패: 유효한 Connection 토큰을 전달하지 않을 시 토큰이 아닌 경우")
    @Test
    void subscribe_fail() throws IOException {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        webTestClient.get()
                .uri("/api/group/sse")
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isUnauthorized()
                .returnResult(String.class);
    }
}
