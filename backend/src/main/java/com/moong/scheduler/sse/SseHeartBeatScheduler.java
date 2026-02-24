package com.moong.scheduler.sse;

import com.moong.event.notification.CustomSseEmitter;
import com.moong.event.notification.SseEventSender;
import com.moong.repository.sse.EmitterRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@RequiredArgsConstructor
public class SseHeartBeatScheduler {

    private static final String HEART_BEAT_COMMENT = "PING";
    private static final long HEART_BEAT_DURATION = 30 * 1000;

    private final EmitterRepository emitterRepository;
    private final SseEventSender sseEventSender;

    @Scheduled(fixedRate = HEART_BEAT_DURATION)
    public void sendHeartbeat() {
        List<CustomSseEmitter> emitters = emitterRepository.findAll();
        emitters.forEach(emitter -> {
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .comment(HEART_BEAT_COMMENT);
            sseEventSender.send(emitter.getMemberId(), event);
        });
    }
}
