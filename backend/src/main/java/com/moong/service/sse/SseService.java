package com.moong.service.sse;

import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.event.notification.SseEventSender;
import com.moong.event.notification.CustomSseEmitter;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.payload.GroupEventPayload;
import com.moong.repository.crew.CrewRepository;
import com.moong.repository.sse.EmitterRepository;
import com.moong.repository.groupconnection.GroupConnectionRepository;
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
                        event.eventType().includeSender() || memberId != event.senderId()
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
