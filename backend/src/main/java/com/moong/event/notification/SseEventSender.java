package com.moong.event.notification;

import com.moong.repository.sse.EmitterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
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
                        log.info("SSE sent successfully. memberId={}", memberId);
                    } catch (Exception e) {
                        log.warn("SSE send failed. memberId={}", memberId, e);
                        sseEmitter.completeWithError(e);
                    }
                });
    }
}
