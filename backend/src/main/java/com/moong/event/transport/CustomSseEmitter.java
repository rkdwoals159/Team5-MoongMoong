package com.moong.event.transport;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Getter
public class CustomSseEmitter {

    private static final long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final SseEmitter sseEmitter;

    public CustomSseEmitter(
            long memberId,
            Runnable leaveAction
    ) {
        this.sseEmitter = new SseEmitter(DEFAULT_TIMEOUT);
        setEmitter(memberId, leaveAction);
    }

    private void setEmitter(long memberId, Runnable leaveAction) {
        sseEmitter.onCompletion(() -> {
            leaveAction.run();
            log.info("SSE completed. memberId={}", memberId);
        });

        sseEmitter.onTimeout(() -> {
            leaveAction.run();
            log.warn("SSE timeout. memberId={}", memberId);
        });

        sseEmitter.onError((e) -> {
            leaveAction.run();
            log.error("SSE error. memberId={}", memberId, e);
        });
    }

    public void complete() {
        this.sseEmitter.complete();
    }
}
