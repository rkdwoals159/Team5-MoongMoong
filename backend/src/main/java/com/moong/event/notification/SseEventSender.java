package com.moong.event.notification;

import com.moong.repository.sse.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
public class SseEventSender {

    private final EmitterRepository emitterRepository;

    public void send(long memberId, SseEmitter.SseEventBuilder event) {
        emitterRepository.findById(memberId)
                .ifPresent(emitter -> {
                    SseEmitter sseEmitter = emitter.getSseEmitter();
                    try {
                        sseEmitter.send(event);
                    } catch (Exception e) {
                        sseEmitter.completeWithError(e);
                    }
                });
    }
}
