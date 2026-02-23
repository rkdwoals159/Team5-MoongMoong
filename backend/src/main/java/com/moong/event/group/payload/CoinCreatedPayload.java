package com.moong.event.group.payload;

import com.moong.domain.bank.Coin;
import com.moong.domain.member.Member;

public record CoinCreatedPayload(
        long coinId,
        long amount,
        String name
) implements GroupEventPayload {

    public CoinCreatedPayload(Member member, Coin coin) {
        this(coin.getId(), coin.getAmount(), member.getName());
    }
}
