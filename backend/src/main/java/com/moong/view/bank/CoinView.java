package com.moong.view.bank;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class CoinView {

    private final long memberId;
    private final String name;
    private final long amount;
    private final LocalDateTime createdAt;

    public CoinView(Coin coin, Member member) {
        this(
                member.getId(),
                member.getName(),
                coin.getAmount(),
                coin.getCreatedAt()
        );
    }
}
