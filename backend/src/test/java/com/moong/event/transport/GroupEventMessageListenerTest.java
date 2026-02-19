package com.moong.event.transport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.DataBaseCleaner;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.group.GroupEvent;
import com.moong.event.EventType;
import com.moong.service.SseService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.Message;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

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
                    assertThat(data.createdAt())
                            .isEqualTo(LocalDateTime.parse("2026-01-30T14:32:15.123"));
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
