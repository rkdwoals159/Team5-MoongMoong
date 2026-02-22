package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.event.SseEventSender;
import com.moong.event.transport.CustomSseEmitter;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.group.GroupEvent;
import com.moong.event.EventType;
import com.moong.repository.EmitterRepository;
import com.moong.repository.groupConnection.GroupConnectionRepository;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

class SseServiceTest extends BaseServiceTest {

    @Autowired
    private SseService sseService;

    @Autowired
    private EmitterRepository emitterRepository;

    @Autowired
    private GroupConnectionRepository groupConnectionRepository;

    @MockitoBean
    private SseEventSender sseEventSender;

    @DisplayName("sseEmitter를 생성하고 Repository에 저장한다.")
    @Test
    void connect() {
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup group = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(group, member);

        SseEmitter returned = sseService.connect(member);

        CustomSseEmitter savedCustom = emitterRepository.findById(member.getId()).orElseThrow();

        List<Long> memberIds =
                groupConnectionRepository.findAllMemberIdsByGroupId(group.getId());

        assertAll(
                () -> assertThat(savedCustom.getSseEmitter()).isSameAs(returned),
                () -> assertThat(memberIds).contains(member.getId()),
                () -> verify(sseEventSender, times(1))
                        .send(eq(member.getId()), any(SseEmitter.SseEventBuilder.class))
        );
    }

    @DisplayName("재연결 시 기존 Emitter는 complete()되고, Repository에는 최신 Emitter만 유지된다")
    @Test
    void reconnect_should_keep_latest_only() {
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup group = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(group, member);

        SseEmitter sseEmitter1 = sseService.connect(member);
        CustomSseEmitter saved1 = emitterRepository.findById(member.getId()).orElseThrow();

        SseEmitter sseEmitter2 = sseService.connect(member);
        CustomSseEmitter saved2 = emitterRepository.findById(member.getId()).orElseThrow();

        assertAll(
                () -> assertThat(saved2.getSseEmitter()).isSameAs(sseEmitter2),
                () -> assertThat(saved1).isNotSameAs(saved2),
                () -> assertThat(emitterRepository.findById(member.getId()).get()).isSameAs(saved2),
                () -> verify(sseEventSender, times(2))
                        .send(eq(member.getId()), any(SseEmitter.SseEventBuilder.class))
        );
    }

    @DisplayName("그룹 이벤트 발생 시 sender를 제외한 연결된 멤버에게 이벤트를 전송한다")
    @Test
    void sendGroupNotification() {
        long groupId = 1L;
        long senderId = 1L;
        long receiver1 = 2L;
        long receiver2 = 3L;

        CoinCreatedPayload payload = new CoinCreatedPayload(1L, 5000, "민수");
        GroupEvent<CoinCreatedPayload> event = new GroupEvent<>(
                EventType.SAVING,
                groupId,
                4L,
                senderId,
                payload
        );
        groupConnectionRepository.save(groupId, senderId);
        groupConnectionRepository.save(groupId, receiver1);
        groupConnectionRepository.save(groupId, receiver2);

        sseService.sendGroupNotification(event);

        assertAll(
                () -> verify(sseEventSender, never()).send(eq(senderId), any(SseEmitter.SseEventBuilder.class)),
                () -> verify(sseEventSender, times(1)).send(eq(receiver1), any(SseEmitter.SseEventBuilder.class)),
                () -> verify(sseEventSender, times(1)).send(eq(receiver2), any(SseEmitter.SseEventBuilder.class))
        );
    }
}
