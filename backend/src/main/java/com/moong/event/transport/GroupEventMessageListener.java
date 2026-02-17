package com.moong.event.transport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.service.SseService;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupEventMessageListener implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SseService sseService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        if (message == null || message.getBody() == null) {
            return;
        }
        try {
            String json = new String(message.getBody(), StandardCharsets.UTF_8);
            GroupEvent<JsonNode> raw = objectMapper.readValue(
                    json, new TypeReference<GroupEvent<JsonNode>>() {}
            );
            GroupEventPayload payload = objectMapper.convertValue(
                    raw.data(),
                    raw.eventType().payloadClass()
            );
            GroupEvent<GroupEventPayload> event = new GroupEvent<>(
                    raw.eventType(),
                    raw.groupId(),
                    raw.eventId(),
                    raw.senderId(),
                    payload
            );

            log.info("received pubsub: eventType={}, eventId={}, groupId={}, senderId={}",
                    event.eventType(), event.eventId(), event.groupId(), event.senderId());

            sseService.handleGroupEvent(event);
        } catch (Exception e) {
            log.error("Failed to parse pubsub message: {}", e.getMessage(), e);
        }
    }
}
