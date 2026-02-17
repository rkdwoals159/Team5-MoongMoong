package com.moong.event.transport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.dto.GroupEventPublishRequest;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.event.transport.key.SseSeqKey;
import com.moong.redis.transport.RedisChannel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupEventPublishListener {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Async("groupEventExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishGroupEvent(GroupEventPublishRequest<? extends GroupEventPayload> request) {
        String seqKey = new SseSeqKey(request.groupId()).value();
        Long eventId = stringRedisTemplate.opsForValue().increment(seqKey);
        if (eventId == null) {
            log.error("eventId increment failed. seqKey={}", seqKey);
            return;
        }

        GroupEvent<GroupEventPayload> event = new GroupEvent<>(
                request.eventType(),
                request.groupId(),
                eventId,
                request.senderId(),
                request.data()
        );

        try {
            String json = objectMapper.writeValueAsString(event);
            stringRedisTemplate.convertAndSend(RedisChannel.SSE_GROUP_EVENT, json);
        } catch (Exception e) {
            log.error("group event publish error: {}", e.getMessage(), e);
        }
    }
}
