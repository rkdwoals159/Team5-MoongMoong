package com.moong.event.transport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.key.channel.RedisChannel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupEventChannelSender {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public void send(GroupEvent<? extends GroupEventPayload> event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            stringRedisTemplate.convertAndSend(RedisChannel.SSE_GROUP_EVENT, json);
            log.info("send group event success. groupId={}, eventId={}, eventType={}",
                    event.groupId(),
                    event.eventId(),
                    event.eventType()
            );
        } catch (Exception e) {
            log.error("send group event failed. seqKey={}, groupId={}, eventType={}",
                    event.eventId(), event.groupId(), event.eventType(), e);
        }
    }
}
