package com.moong.event.transport;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.group.GroupEvent;
import com.moong.event.group.GroupEventPayload;
import com.moong.event.group.GroupEventType;
import com.moong.redis.transport.RedisChannel;
import com.moong.service.BaseServiceTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

class GroupEventChannelSenderTest extends BaseServiceTest {

    @Autowired
    private GroupEventChannelSender groupEventChannelSender;

    @MockitoBean
    private StringRedisTemplate stringRedisTemplate;

    @MockitoBean
    private ObjectMapper objectMapper;

    @Mock
    ValueOperations<String, String> valueOps;

    public record TestDto(
            String message
    ) implements GroupEventPayload {
    }

    @DisplayName("sendGroupEvent: Redis INCR로 eventId를 만들고 GroupEvent를 publish 한다")
    @Test
    void sendSuccess() throws JsonProcessingException {
        Member member = memberGenerator.generateSaved("멤버1");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup, member);
        String json = """
                {
                  "eventType": "SAVING",
                  "eventId": 10,
                  "groupId": 1,
                  "senderId": 3,
                  "data": {
                    "message": "test"
                  }
                }
                """;

        long memberId = member.getId();
        long groupId = petGroup.getId();
        String expectedSeqKey = "sse:seq:groupId:" + groupId;
        GroupEventType type = GroupEventType.SAVING;
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        when(objectMapper.writeValueAsString(any(GroupEvent.class))).thenReturn(json);
        when(valueOps.increment(expectedSeqKey)).thenReturn(1L);

        GroupEventMessage<TestDto> request =
                new GroupEventMessage<>(type, groupId, memberId, new TestDto("테스트"));

        groupEventChannelSender.sendAsync(request);

        assertAll(
                () -> verify(valueOps).increment(expectedSeqKey),
                () -> verify(objectMapper).writeValueAsString(any(GroupEvent.class)),
                () -> verify(stringRedisTemplate).convertAndSend(RedisChannel.SSE_GROUP_EVENT, json)
        );
    }

    @DisplayName("eventId가 null이면 publish하지 않는다")
    @Test
    void send_skip_whenEventIdIsNull() throws Exception {
        GroupEventMessage<TestDto> req =
                new GroupEventMessage<>(GroupEventType.SAVING, 1L, 10L, new TestDto("test"));

        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.increment(anyString())).thenReturn(null);

        groupEventChannelSender.sendAsync(req);

        assertAll(
                () -> verify(objectMapper, never()).writeValueAsString(any()),
                () -> verify(stringRedisTemplate, never()).convertAndSend(anyString(), anyString())
        );
    }

    @DisplayName("직렬화 실패 시 Redis에 발행하지 않는다.")
    @Test
    void send_fail_whenSerializeThrows() throws Exception {
        GroupEventMessage<TestDto> groupEventMessage =
                new GroupEventMessage<>(GroupEventType.SAVING, 1L, 3L, new TestDto("test"));
        String seq_key = "sse:seq:groupId:" + 1L;
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.increment(seq_key)).thenReturn(1L);
        when(objectMapper.writeValueAsString(GroupEvent.class))
                .thenThrow(new RuntimeException("serialize error"));

        groupEventChannelSender.sendAsync(groupEventMessage);

        verify(stringRedisTemplate, never()).convertAndSend(anyString(), anyString());
    }

    @DisplayName("convertAndSend 실패 시 예외를 삼키고 종료한다")
    @Test
    void send_fail_whenRedisThrows() throws Exception {
        GroupEventMessage<TestDto> req =
                new GroupEventMessage<>(GroupEventType.SAVING, 1L, 10L, new TestDto("test"));

        String seqKey = "sse:seq:groupId:" + 1L;
        String json = "{ \"dummy\": true }";

        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.increment(seqKey)).thenReturn(1L);

        when(objectMapper.writeValueAsString(any())).thenReturn(json);

        doThrow(new RuntimeException("redis down"))
                .when(stringRedisTemplate)
                .convertAndSend(eq(RedisChannel.SSE_GROUP_EVENT), eq(json));

        assertAll(
                () -> assertDoesNotThrow(() -> groupEventChannelSender.sendAsync(req)),
                () -> verify(stringRedisTemplate).convertAndSend(eq(RedisChannel.SSE_GROUP_EVENT), eq(json))
        );
    }
}
