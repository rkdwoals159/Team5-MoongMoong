package com.moong.event.dto;

import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;

public record PaymentSuccessEvent(
        Member member,
        Crew crew,
        Coin coin,
        long groupId
) {
}
