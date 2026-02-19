package com.moong.event.transport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.event.transport.key.SseSeqKey;
import com.moong.redis.transport.RedisChannel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupEventChannelSender {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Async("groupEventChannelExecutor")
    public void sendAsync(GroupEventMessage<? extends GroupEventPayload> message) {
        String seqKey = new SseSeqKey(message.groupId()).value();
        Long eventId = stringRedisTemplate.opsForValue().increment(seqKey);
        if (eventId == null) {
            log.error("eventId increment failed. seqKey={}", seqKey);
            return;
        }

        GroupEvent<GroupEventPayload> event = new GroupEvent<>(
                message.eventType(),
                message.groupId(),
                eventId,
                message.senderId(),
                message.data()
        );

        try {
            String json = objectMapper.writeValueAsString(event);
            stringRedisTemplate.convertAndSend(RedisChannel.SSE_GROUP_EVENT, json);
        } catch (Exception e) {
            log.error("group event publish error: {}", e.getMessage(), e);
        }
    }
}
