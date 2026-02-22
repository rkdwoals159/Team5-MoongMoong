package com.moong.convertor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moong.event.EventType;
import com.moong.event.group.GroupEventPayload;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GroupEventPayloadConverter {

    private final ObjectMapper objectMapper;

    public GroupEventPayload fromJson(String payloadJson, EventType eventType) {

        if (payloadJson == null) {
            throw new BusinessException(ErrorCode.EVENT_PAYLOAD_NULL);
        }

        try {
            return objectMapper.readValue(payloadJson, eventType.payloadClass());
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.EVENT_DESERIALIZE_ERROR);
        }
    }

    public String toJson(GroupEventPayload payload) {

        if (payload == null) {
            throw new BusinessException(ErrorCode.EVENT_PAYLOAD_NULL);
        }

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.EVENT_SERIALIZE_ERROR);
        }
    }
}
