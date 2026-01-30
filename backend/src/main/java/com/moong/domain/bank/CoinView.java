package com.moong.domain.bank;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class CoinView {

    private final String name;
    private final long amount;
    private final LocalDateTime createdAt;

    public CoinView(Coin coin, Member member) {
        this.name = member.getName();
        this.amount = coin.getAmount();
        this.createdAt = coin.getCreatedAt();
    }
}
