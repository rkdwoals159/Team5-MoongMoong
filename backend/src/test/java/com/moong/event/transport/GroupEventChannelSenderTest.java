package com.moong.event.transport;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.group.EventType;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.payload.GroupEventPayload;
import com.moong.event.notification.GroupEventChannelSender;
import com.moong.domain.notification.channel.RedisChannel;
import com.moong.service.BaseServiceTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

class GroupEventChannelSenderTest extends BaseServiceTest {

    @Autowired
    private GroupEventChannelSender groupEventChannelSender;

    @MockitoBean
    private StringRedisTemplate stringRedisTemplate;

    @MockitoBean
    private ObjectMapper objectMapper;

    public record TestDto(String message) implements GroupEventPayload {}

    @DisplayName("sendAsync: GroupEvent를 직렬화하고 Redis에 publish 한다")
    @Test
    void sendSuccess() throws JsonProcessingException {
        GroupEvent<TestDto> event = new GroupEvent<>(
            EventType.NUDGE,
                1L,
                100L,
                3L,
                new TestDto("테스트")
        );

        String json = """
                {
                  "eventType": "SAVING",
                  "eventId": 100,
                  "groupId": 1,
                  "senderId": 3,
                  "data": { "message": "테스트" }
                }
                """;

        when(objectMapper.writeValueAsString(any(GroupEvent.class))).thenReturn(json);

        // when
        groupEventChannelSender.send(event);

        // then
        assertAll(
                () -> verify(objectMapper).writeValueAsString(any(GroupEvent.class)),
                () -> verify(stringRedisTemplate).convertAndSend(RedisChannel.SSE_GROUP_EVENT, json)
        );
    }

    @DisplayName("직렬화 실패 시 Redis에 발행하지 않는다")
    @Test
    void send_skip_whenSerializeThrows() throws Exception {
        GroupEvent<TestDto> event = new GroupEvent<>(
                EventType.NUDGE,
                1L,
                100L,
                3L,
                new TestDto("테스트")
        );

        when(objectMapper.writeValueAsString(any(GroupEvent.class)))
                .thenThrow(new RuntimeException("serialize error"));

        groupEventChannelSender.send(event);

        verify(stringRedisTemplate, never()).convertAndSend(anyString(), anyString());
    }

    @DisplayName("convertAndSend 실패 시 예외를 삼키고 종료한다")
    @Test
    void send_fail_whenRedisThrows() throws Exception {
        GroupEvent<TestDto> event = new GroupEvent<>(
                EventType.NUDGE,
                1L,
                100L,
                3L,
                new TestDto("테스트")
        );
        String json = """
                {
                  "eventType": "SAVING",
                  "eventId": 100,
                  "groupId": 1,
                  "senderId": 3,
                  "data": { "message": "테스트" }
                }
                """;
        when(objectMapper.writeValueAsString(any(GroupEvent.class))).thenReturn(json);

        doThrow(new RuntimeException("redis down"))
                .when(stringRedisTemplate)
                .convertAndSend(eq(RedisChannel.SSE_GROUP_EVENT), eq(json));

        assertAll(
                () -> assertDoesNotThrow(() -> groupEventChannelSender.send(event)),
                () -> verify(stringRedisTemplate).convertAndSend(eq(RedisChannel.SSE_GROUP_EVENT), eq(json))
        );
    }
}
