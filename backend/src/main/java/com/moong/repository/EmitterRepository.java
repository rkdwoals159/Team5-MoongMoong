package com.moong.repository;

import com.moong.event.transport.CustomSseEmitter;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class EmitterRepository {

    private final Map<Long, CustomSseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(long memberId, CustomSseEmitter sseEmitter) {
        emitters.put(memberId, sseEmitter);
    }

    public Optional<CustomSseEmitter> findById(long memberId) {
        return Optional.ofNullable(emitters.get(memberId));
    }

    public void deleteById(long memberId) {
        emitters.remove(memberId);
    }
}
