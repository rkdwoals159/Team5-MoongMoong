package com.moong.event;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.moong.event.notification.CustomSseEmitter;
import com.moong.event.notification.SseEventSender;
import com.moong.repository.sse.EmitterRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@ExtendWith(MockitoExtension.class)
class SseEventSenderTest {

    @Mock
    private EmitterRepository emitterRepository;

    @Mock
    private CustomSseEmitter customSseEmitter;

    @Mock
    private SseEmitter sseEmitter;

    @InjectMocks
    private SseEventSender sseEventSender;

    @DisplayName("emitter가 존재하면 SseEmitter.send(event)를 호출한다")
    @Test
    void send_whenEmitterExists_callsSend() throws Exception {
        long memberId = 1L;
        SseEmitter.SseEventBuilder event = SseEmitter.event().name("TEST").id("1");

        when(emitterRepository.findById(memberId)).thenReturn(Optional.of(customSseEmitter));
        when(customSseEmitter.getSseEmitter()).thenReturn(sseEmitter);

        sseEventSender.send(memberId, event);

        assertAll(
                () -> verify(sseEmitter, times(1)).send(event),
                () -> verify(sseEmitter, never()).completeWithError(any())
        );
    }

    @DisplayName("emitter가 없으면 아무 것도 호출하지 않는다")
    @Test
    void send_whenEmitterMissing_doesNothing() {
        long memberId = 1L;
        SseEmitter.SseEventBuilder event = SseEmitter.event().name("TEST").id("1");
        when(emitterRepository.findById(memberId)).thenReturn(Optional.empty());

        sseEventSender.send(memberId, event);

        assertAll(
                () -> verify(customSseEmitter, never()).getSseEmitter(),
                () -> verifyNoInteractions(sseEmitter)
        );
    }

    @DisplayName("SseEmitter.send에서 예외가 발생하면 completeWithError를 호출한다")
    @Test
    void send_whenSendThrows_callsCompleteWithError() throws Exception {
        long memberId = 1L;
        SseEmitter.SseEventBuilder event = SseEmitter.event().name("TEST").id("1");

        when(emitterRepository.findById(memberId)).thenReturn(Optional.of(customSseEmitter));
        when(customSseEmitter.getSseEmitter()).thenReturn(sseEmitter);

        RuntimeException ex = new RuntimeException("error");
        doThrow(ex).when(sseEmitter).send(event);

        sseEventSender.send(memberId, event);

        assertAll(
                () -> verify(sseEmitter, times(1)).send(event),
                () -> verify(sseEmitter, times(1)).completeWithError(ex)
        );
    }
}
