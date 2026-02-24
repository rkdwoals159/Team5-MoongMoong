package com.moong.repository.sse;

import com.moong.event.notification.CustomSseEmitter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class EmitterRepository {

    private final ConcurrentHashMap<Long, CustomSseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(long memberId, CustomSseEmitter emitter) {
        CustomSseEmitter previousEmitter = emitters.get(memberId);

        if (previousEmitter != null) {
            previousEmitter.complete();
        }
        emitters.put(memberId, emitter);
    }

    public Optional<CustomSseEmitter> findById(long memberId) {
        return Optional.ofNullable(emitters.get(memberId));
    }

    public List<CustomSseEmitter> findAll() {
        return emitters.values().stream().toList();
    }

    public boolean deleteByMemberIdAndEmitter(long memberId, CustomSseEmitter emitter) {
        return emitters.remove(memberId, emitter);
    }
}
