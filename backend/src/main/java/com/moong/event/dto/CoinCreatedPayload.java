package com.moong.event.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Member;
import com.moong.event.group.GroupEventPayload;
import com.moong.serdes.LocalDateTimeWithOffsetDeserializer;
import java.time.LocalDateTime;

public record CoinCreatedPayload(
        long coinId,
        @JsonDeserialize(using = LocalDateTimeWithOffsetDeserializer.class)
        LocalDateTime createdAt,
        long amount,
        String name
) implements GroupEventPayload {

        CoinCreatedPayload(Member member, Coin coin) {
                this(coin.getId(), coin.getCreatedAt(), coin.getAmount(), member.getName());
        }
}
