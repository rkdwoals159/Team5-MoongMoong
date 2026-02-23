package com.moong.event.dto;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import com.moong.event.EventType;
import com.moong.event.group.GroupEventPayload;

public record GroupEventMessage<T extends GroupEventPayload>(
        EventType eventType,
        long groupId,
        long senderId,
        T data,
        boolean includeSender
) {

    public static GroupEventMessage<CoinCreatedPayload> saving(
            Member member,
            long groupId,
            Coin coin
    ) {
        return new GroupEventMessage<>(
                EventType.SAVING,
                groupId,
                member.getId(),
                new CoinCreatedPayload(member, coin),
                false
        );
    }

    public static GroupEventMessage<AiAdviceCreatedPayload> adviceCreated(
            long memberId,
            long groupId
    ) {
        return new GroupEventMessage<>(
                EventType.AI_ADVICE_CREATED,
                groupId,
                memberId,
                new AiAdviceCreatedPayload(),
                true
        );
    }
}
