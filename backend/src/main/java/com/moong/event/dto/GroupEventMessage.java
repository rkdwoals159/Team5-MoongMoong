package com.moong.event.dto;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import com.moong.event.group.GroupEventPayload;
import com.moong.event.group.GroupEventType;

public record GroupEventMessage<T extends GroupEventPayload>(
        GroupEventType eventType,
        long groupId,
        long senderId,
        T data
) {

    public static GroupEventMessage<CoinCreatedPayload> saving(
            Member member,
            long groupId,
            Coin coin
    ) {
        return new GroupEventMessage<>(
                GroupEventType.SAVING,
                groupId,
                member.getId(),
                new CoinCreatedPayload(member, coin)
        );
    }
}
