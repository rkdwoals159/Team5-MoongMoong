package com.moong.event.group;

import com.moong.domain.bank.Coin;
import com.moong.domain.member.Member;
import com.moong.event.group.payload.AiAdviceCreatedPayload;
import com.moong.event.group.payload.CoinCreatedPayload;
import com.moong.event.group.payload.GroupEventPayload;

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
