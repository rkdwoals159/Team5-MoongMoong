package com.moong.event.dto;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import com.moong.event.group.GroupEventPayload;

public record CoinCreatedPayload(
        long coinId,
        long amount,
        String name
) implements GroupEventPayload {

    CoinCreatedPayload(Member member, Coin coin) {
        this(coin.getId(), coin.getAmount(), member.getName());
    }
}
