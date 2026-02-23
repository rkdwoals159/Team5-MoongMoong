package com.moong.event.transport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.DataBaseCleaner;
import com.moong.event.EventType;
import com.moong.event.dto.AiAdviceCreatedPayload;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.group.GroupEvent;
import com.moong.service.SseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.Message;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ActiveProfiles("test")
@ExtendWith(DataBaseCleaner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class GroupEventMessageListenerTest {

    private GroupEventMessageListener groupEventMessageListener;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SseService sseService;

    @BeforeEach
    void setUp() {
        groupEventMessageListener = new GroupEventMessageListener(objectMapper, sseService);
    }

    @DisplayName("onMessage: 바깥 필드(eventType/eventId/groupId/senderId)가 매핑되고 data는 CoinCreateEventResponse로 변환된다")
    @Test
    void onMessage_parseOuterFields() {
        String json = """
                {
                  "eventType": "SAVING",
                  "eventId": 10,
                  "groupId": 1,
                  "senderId": 3,
                  "data": {
                    "coinId": 1,
                    "createdAt": "2026-01-30T14:32:15.123+09:00",
                    "amount": 5000,
                    "name": "민수"
                  }
                }
                """;
        Message message = mock(Message.class);
        when(message.getBody()).thenReturn(json.getBytes(StandardCharsets.UTF_8));

        groupEventMessageListener.onMessage(message, null);

        ArgumentCaptor<GroupEvent<CoinCreatedPayload>> captor =
                ArgumentCaptor.forClass(GroupEvent.class);

        verify(sseService).sendGroupNotification(captor.capture());

        GroupEvent<CoinCreatedPayload> event = captor.getValue();

        assertAll(
                () -> assertThat(event.eventType()).isEqualTo(EventType.SAVING),
                () -> assertThat(event.eventId()).isEqualTo(10L),
                () -> assertThat(event.groupId()).isEqualTo(1L),
                () -> assertThat(event.senderId()).isEqualTo(3L),
                () -> assertThat(event.data()).isNotNull(),
                () -> assertThat(event.data()).isInstanceOf(CoinCreatedPayload.class),
                () -> {
                    CoinCreatedPayload data = (CoinCreatedPayload) event.data();
                    assertThat(data.coinId()).isEqualTo(1L);
                    assertThat(data.amount()).isEqualTo(5000);
                    assertThat(data.name()).isEqualTo("민수");
                }
        );
    }

    @DisplayName("data는 정상적으로 AdviceCreatedPayload로 변환된다")
    @Test
    void onMessage_parseOuterFields_AdviceCreatedPayload() {
        String json = """
                {
                  "eventType": "AI_ADVICE_CREATED",
                  "eventId": 10,
                  "groupId": 1,
                  "senderId": 3,
                  "data": {
                    "message": "AI 의사 권장사항 생성이 완료되었습니다!"
                  }
                }
                """;
        Message message = mock(Message.class);
        when(message.getBody()).thenReturn(json.getBytes(StandardCharsets.UTF_8));

        groupEventMessageListener.onMessage(message, null);

        ArgumentCaptor<GroupEvent<AiAdviceCreatedPayload>> captor =
                ArgumentCaptor.forClass(GroupEvent.class);

        verify(sseService).sendGroupNotification(captor.capture());

        GroupEvent<AiAdviceCreatedPayload> event = captor.getValue();

        assertAll(
                () -> assertThat(event.eventType()).isEqualTo(EventType.AI_ADVICE_CREATED),
                () -> assertThat(event.eventId()).isEqualTo(10L),
                () -> assertThat(event.groupId()).isEqualTo(1L),
                () -> assertThat(event.senderId()).isEqualTo(3L),
                () -> assertThat(event.data()).isNotNull(),
                () -> assertThat(event.data()).isInstanceOf(AiAdviceCreatedPayload.class),
                () -> {
                    AiAdviceCreatedPayload data = event.data();
                    assertThat(data.message()).isEqualTo("AI 의사 권장사항 생성이 완료되었습니다!");
                }
        );
    }

    @DisplayName("onMessage: 파싱 실패 시 handleGroupEvent를 호출하지 않는다")
    @Test
    void onMessage_fail_doesNotCallHandle() {
        String badJson = "{ invalid json";

        Message message = mock(Message.class);
        when(message.getBody()).thenReturn(badJson.getBytes(StandardCharsets.UTF_8));

        groupEventMessageListener.onMessage(message, null);

        Mockito.verifyNoInteractions(sseService);
    }
}
