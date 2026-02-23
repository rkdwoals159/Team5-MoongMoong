package com.moong.event.payment;

import com.moong.domain.bank.Coin;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;

public record PaymentSuccessEvent(
        Member member,
        Crew crew,
        Coin coin,
        long groupId
) {
}
