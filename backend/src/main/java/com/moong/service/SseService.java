package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.event.SseEventSender;
import com.moong.event.dto.AiAdviceCreatedPayload;
import com.moong.event.transport.CustomSseEmitter;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.repository.CrewRepository;
import com.moong.repository.EmitterRepository;
import com.moong.repository.groupConnection.GroupConnectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseService {

    private static final String CONNECTION_EVENT_NAME = "CONNECTION";

    private final EmitterRepository emitterRepository;
    private final CrewRepository crewRepository;
    private final GroupConnectionRepository groupConnectionRepository;
    private final SseEventSender sseEventSender;

    public SseEmitter connect(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        long groupId = crew.getPetGroup().getId();

        CustomSseEmitter customSseEmitter = new CustomSseEmitter(member.getId());

        customSseEmitter.configureLifecycleCallbacks(() -> {
            boolean removed =  emitterRepository.deleteByMemberIdAndEmitter(member.getId(), customSseEmitter);
            if (removed) {
                groupConnectionRepository.delete(groupId, member.getId());
            }
        });

        joinGroup(customSseEmitter, member, groupId);

        SseEmitter.SseEventBuilder event = SseEmitter.event()
                .name(CONNECTION_EVENT_NAME)
                .id(String.valueOf(member.getId()));
        sseEventSender.send(member.getId(), event);
        return customSseEmitter.getSseEmitter();
    }

    private void joinGroup(CustomSseEmitter sseEmitter, Member member, long groupId) {
        emitterRepository.save(member.getId(), sseEmitter);
        groupConnectionRepository.save(groupId, member.getId());
    }

    public void sendGroupNotification(GroupEvent<? extends GroupEventPayload> event) {
        groupConnectionRepository.findAllMemberIdsByGroupId(event.groupId()).stream()
                .filter(memberId ->
                        (event.data() instanceof AiAdviceCreatedPayload) || memberId != event.senderId()
                )
                .forEach(memberId -> {
                    SseEmitter.SseEventBuilder eventBuilder = SseEmitter.event()
                            .id(String.valueOf(event.eventId()))
                            .name(event.eventType().name())
                            .data(event.data());
                    sseEventSender.send(memberId, eventBuilder);
                });
    }
}
