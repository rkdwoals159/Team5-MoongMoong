package com.moong.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.*;

import com.moong.event.transport.CustomSseEmitter;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmitterRepositoryTest {

    private final EmitterRepository emitterRepository = new EmitterRepository();

    @Test
    @DisplayName("재연결 시 기존 Emitter는 complete() 되고, Map에는 항상 최신 Emitter만 유지된다")
    void save_should_complete_previous_and_keep_latest_only() {
        long memberId = 1L;

        CustomSseEmitter oldEmitter = mock(CustomSseEmitter.class);
        CustomSseEmitter newEmitter = mock(CustomSseEmitter.class);

        emitterRepository.save(memberId, oldEmitter);
        emitterRepository.save(memberId, newEmitter);
        Optional<CustomSseEmitter> latest = emitterRepository.findById(memberId);

        assertAll(
                () -> verify(oldEmitter, times(1)).complete(),
                () -> verifyNoMoreInteractions(oldEmitter),
                () -> assertThat(latest).contains(newEmitter)
        );
    }

    @Test
    @DisplayName("이전 Emitter의 콜백이 늦게 실행되더라도, 최신 Emitter는 삭제되지 않는다")
    void deleteByMemberIdAndEmitter_should_not_remove_when_not_latest() {
        long memberId = 1L;

        CustomSseEmitter oldEmitter = mock(CustomSseEmitter.class);
        CustomSseEmitter newEmitter = mock(CustomSseEmitter.class);

        emitterRepository.save(memberId, oldEmitter);
        emitterRepository.save(memberId, newEmitter);

        boolean removed = emitterRepository.deleteByMemberIdAndEmitter(memberId, oldEmitter);

        assertAll(
                () -> assertThat(removed).isFalse(),
                () -> assertThat(emitterRepository.findById(memberId)).contains(newEmitter)
        );
    }

    @Test
    @DisplayName("현재 Map에 저장된 최신 Emitter가 종료될 때만 실제로 삭제된다")
    void deleteByMemberIdAndEmitter_should_remove_when_latest() {
        long memberId = 1L;

        CustomSseEmitter oldEmitter = mock(CustomSseEmitter.class);
        CustomSseEmitter newEmitter = mock(CustomSseEmitter.class);

        emitterRepository.save(memberId, oldEmitter);
        emitterRepository.save(memberId, newEmitter);

        boolean removed = emitterRepository.deleteByMemberIdAndEmitter(memberId, newEmitter);

        assertAll(
                () -> assertThat(removed).isTrue(),
                () -> assertThat(emitterRepository.findById(memberId)).isEmpty()
        );
    }
}
